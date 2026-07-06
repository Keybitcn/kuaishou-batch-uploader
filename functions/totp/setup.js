import { getSessionCookie, verifySession } from "../_shared.js";
import {
  buildOtpAuthUrl,
  buildQrUrl,
  isTotpEnabled,
  verifyTotpCode,
} from "../_totp.js";
import { parseCredentials } from "../_auth.js";

export async function onRequestGet({ env, request }) {
  const adminPassword = env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return new Response(JSON.stringify({ ok: false, error: "not_configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const session = getSessionCookie(request);
  if (!(await verifySession(adminPassword, session))) {
    return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  if (!isTotpEnabled(env)) {
    return new Response(JSON.stringify({ ok: false, error: "totp_not_configured" }), {
      status: 404,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const issuer = "Key Blog";
  const account = "admin@quna.fun";
  const otpauthUrl = buildOtpAuthUrl(env.TOTP_SECRET, account, issuer);

  return new Response(
    JSON.stringify({
      ok: true,
      issuer,
      account,
      secret: env.TOTP_SECRET,
      otpauth_url: otpauthUrl,
      qr_url: buildQrUrl(otpauthUrl),
    }),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function onRequestPost({ env, request }) {
  const adminPassword = env.ADMIN_PASSWORD;
  if (!adminPassword || !isTotpEnabled(env)) {
    return new Response(JSON.stringify({ ok: false, error: "not_configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const credentials = await parseCredentials(request);
  if (credentials.password !== adminPassword) {
    return new Response(JSON.stringify({ ok: false, error: "invalid_password" }), {
      status: 401,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const valid = await verifyTotpCode(env.TOTP_SECRET, credentials.totp);
  return new Response(JSON.stringify({ ok: valid }), {
    status: valid ? 200 : 401,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}