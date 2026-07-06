import {
  createSession,
  getSessionCookie,
  sessionCookieHeader,
  verifySession,
} from "./_shared.js";

export async function onRequestGet({ env, request }) {
  const adminPassword = env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return new Response(JSON.stringify({ ok: false }), {
      status: 503,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const session = getSessionCookie(request);
  const ok = await verifySession(adminPassword, session);

  return new Response(JSON.stringify({ ok }), {
    status: ok ? 200 : 401,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function onRequestPost({ env, request }) {
  const adminPassword = env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return new Response(JSON.stringify({ ok: false, error: "not_configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  let password = "";
  const contentType = request.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    password = String(body.password || "");
  } else {
    const form = await request.formData();
    password = String(form.get("password") || "");
  }

  if (password !== adminPassword) {
    return new Response(JSON.stringify({ ok: false, error: "invalid_password" }), {
      status: 401,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const session = await createSession(adminPassword);
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": sessionCookieHeader(session),
      "Cache-Control": "no-store",
    },
  });
}