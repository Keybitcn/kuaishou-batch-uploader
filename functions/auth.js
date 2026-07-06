import {
  authResponse,
  createSession,
  getOrigins,
  getSessionCookie,
  issueGithubToken,
  passwordForm,
  sessionCookieHeader,
  verifySession,
} from "./_shared.js";

async function handlePatAuth({ env, request }) {
  const origins = getOrigins(env);
  const adminPassword = env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return new Response(
      "安全未配置：请在 Cloudflare Pages 环境变量中设置 ADMIN_PASSWORD",
      { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const session = getSessionCookie(request);
  if (await verifySession(adminPassword, session)) {
    return issueGithubToken(env, origins, adminPassword);
  }

  return new Response(passwordForm(origins), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function onRequestGet({ env, request }) {
  const origins = getOrigins(env);
  const token = env.GITHUB_TOKEN;
  const clientId = env.GITHUB_CLIENT_ID;

  if (token && !clientId) {
    return handlePatAuth({ env, request });
  }

  if (!clientId) {
    return new Response(
      "登录未配置：请设置 GITHUB_TOKEN + ADMIN_PASSWORD，或配置 GitHub OAuth",
      { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const clientSecret = env.GITHUB_CLIENT_SECRET;
  if (!clientSecret) {
    return new Response("OAuth 未配置：请设置 GITHUB_CLIENT_SECRET", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/callback`;
  const state = crypto.randomUUID();
  const scope = "repo,user";
  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("state", state);

  return Response.redirect(authUrl.toString(), 302);
}

export async function onRequestPost({ env, request }) {
  const origins = getOrigins(env);
  const adminPassword = env.ADMIN_PASSWORD;
  const token = env.GITHUB_TOKEN;
  const clientId = env.GITHUB_CLIENT_ID;

  if (!token || clientId) {
    return new Response("不支持此登录方式", {
      status: 405,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  if (!adminPassword) {
    return new Response(
      "安全未配置：请在 Cloudflare Pages 环境变量中设置 ADMIN_PASSWORD",
      { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  let password = "";
  const contentType = request.headers.get("Content-Type") || "";
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    password = String(form.get("password") || "");
  } else {
    const body = await request.json().catch(() => ({}));
    password = String(body.password || "");
  }

  if (password !== adminPassword) {
    return new Response(passwordForm(origins, "密码错误，请重试"), {
      status: 401,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return issueGithubToken(env, origins, adminPassword);
}