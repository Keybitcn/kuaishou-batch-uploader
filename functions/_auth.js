import { isTotpEnabled, verifyTotpCode } from "./_totp.js";

export async function verifyAdminCredentials(env, { password, totp }) {
  const adminPassword = env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return { ok: false, error: "not_configured" };
  }

  if (password !== adminPassword) {
    return { ok: false, error: "invalid_password" };
  }

  if (isTotpEnabled(env)) {
    const validTotp = await verifyTotpCode(env.TOTP_SECRET, totp);
    if (!validTotp) {
      return { ok: false, error: "invalid_totp" };
    }
  }

  return { ok: true };
}

export async function parseCredentials(request) {
  const contentType = request.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    return {
      password: String(body.password || ""),
      totp: String(body.totp || ""),
    };
  }

  const form = await request.formData();
  return {
    password: String(form.get("password") || ""),
    totp: String(form.get("totp") || ""),
  };
}

export function credentialErrorMessage(error) {
  if (error === "invalid_totp") return "动态口令错误，请重试";
  if (error === "invalid_password") return "密码错误，请重试";
  return "登录失败，请重试";
}