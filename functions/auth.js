import {
  credentialErrorMessage,
  parseCredentials,
  verifyAdminCredentials,
} from "./_auth.js";
import { isTotpEnabled } from "./_totp.js";
import {
  getOrigins,
  getSessionCookie,
  issueGithubToken,
  passwordForm,
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

  return new Response(
    passwordForm(origins, "", { totpRequired: isTotpEnabled(env) }),
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
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

  const credentials = await parseCredentials(request);
  const result = await verifyAdminCredentials(env, credentials);
  if (!result.ok) {
    return new Response(
      passwordForm(origins, credentialErrorMessage(result.error), {
        totpRequired: isTotpEnabled(env),
      }),
      {
        status: 401,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }

  return issueGithubToken(env, origins, adminPassword);
}