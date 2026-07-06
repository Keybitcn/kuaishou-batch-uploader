import {
  credentialErrorMessage,
  parseCredentials,
  verifyAdminCredentials,
} from "./_auth.js";
import { isTotpEnabled } from "./_totp.js";
import {
  createSession,
  getSessionCookie,
  sessionCookieHeader,
  verifySession,
} from "./_shared.js";

export async function onRequestGet({ env, request }) {
  const adminPassword = env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return new Response(JSON.stringify({ ok: false, totp_required: false }), {
      status: 503,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const session = getSessionCookie(request);
  const ok = await verifySession(adminPassword, session);

  return new Response(
    JSON.stringify({ ok, totp_required: isTotpEnabled(env) }),
    {
      status: ok ? 200 : 401,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function onRequestPost({ env, request }) {
  const adminPassword = env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return new Response(JSON.stringify({ ok: false, error: "not_configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const credentials = await parseCredentials(request);
  const result = await verifyAdminCredentials(env, credentials);
  if (!result.ok) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: result.error,
        message: credentialErrorMessage(result.error),
        totp_required: isTotpEnabled(env),
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );
  }

  const session = await createSession(adminPassword);
  return new Response(JSON.stringify({ ok: true, totp_required: isTotpEnabled(env) }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": sessionCookieHeader(session),
      "Cache-Control": "no-store",
    },
  });
}