const SESSION_COOKIE = "cms_session";
const SESSION_MAX_AGE = 60 * 60 * 12;

export function getOrigins(env) {
  return env.ALLOWED_ORIGIN || "quna.fun,www.quna.fun";
}

export function getSessionCookie(request) {
  const header = request.headers.get("Cookie") || "";
  const match = header.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}

async function hmacSign(secret, payload) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function hmacVerify(secret, payload, signature) {
  const expected = await hmacSign(secret, payload);
  return expected === signature;
}

export async function createSession(secret) {
  const exp = String(Date.now() + SESSION_MAX_AGE * 1000);
  const sig = await hmacSign(secret, exp);
  return { value: `${exp}.${sig}`, maxAge: SESSION_MAX_AGE };
}

export async function verifySession(secret, cookieValue) {
  if (!secret || !cookieValue) return false;
  const [exp, sig] = cookieValue.split(".");
  if (!exp || !sig) return false;
  if (Date.now() > Number(exp)) return false;
  return hmacVerify(secret, exp, sig);
}

export function sessionCookieHeader(session) {
  return `${SESSION_COOKIE}=${session.value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${session.maxAge}`;
}

export function authResponse(provider, status, content, origins) {
  const allowed = JSON.stringify(origins.split(",").map((o) => o.trim()));
  const payload = JSON.stringify(content);

  return `<!DOCTYPE html><html lang="zh-CN" data-theme="dark"><head><meta charset="utf-8"><title>登录中…</title>
<style>
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0a0a0a; color:#f0f0f0; font:14px system-ui,sans-serif; }
  p { margin:0; }
</style></head><body>
<p id="status">正在登录，请稍候…</p>
<script>
(function() {
  var provider = ${JSON.stringify(provider)};
  var status = ${JSON.stringify(status)};
  var payload = ${JSON.stringify(payload)};
  var origins = ${allowed};
  var authPrefix = "authorization:" + provider + ":" + status + ":";

  function originAllowed(origin) {
    if (!origin) return false;
    var host = origin.replace(/^https?:\\/\\//, "").replace(/:\\d+$/, "");
    return origins.some(function(item) {
      if (item.indexOf("*") >= 0) {
        var regex = new RegExp("^" + item.replace(/\\./g, "\\\\.").replace(/\\*/g, "[\\\\w.-]+") + "$");
        return regex.test(host);
      }
      return item === host;
    });
  }

  function complete(event) {
    if (!window.opener) return;
    window.opener.postMessage(authPrefix + payload, event.origin);
    document.getElementById("status").textContent = "登录成功，正在关闭窗口…";
    setTimeout(function() { window.close(); }, 300);
  }

  function onMessage(event) {
    if (!originAllowed(event.origin)) return;
    if (event.data === "authorizing:" + provider) {
      complete(event);
    }
  }

  window.addEventListener("message", onMessage, false);
  if (window.opener) {
    window.opener.postMessage("authorizing:" + provider, "*");
  } else {
    document.getElementById("status").textContent = "请从管理页面重新打开登录窗口。";
  }
})();
</script></body></html>`;
}

export function passwordForm(origins, errorMessage = "", options = {}) {
  const error = errorMessage
    ? `<p style="color:#ef4444;margin:0 0 12px;">${errorMessage}</p>`
    : "";
  const totpField = options.totpRequired
    ? `<label for="totp">动态口令</label>
  <input id="totp" name="totp" type="text" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" placeholder="Authenticator 6 位数字" required />`
    : "";
  const intro = options.totpRequired
    ? "请输入管理密码和 Authenticator 动态口令。"
    : "请输入管理密码后继续。";

  return `<!DOCTYPE html><html lang="zh-CN" data-theme="dark"><head><meta charset="utf-8"><title>管理登录</title>
<style>
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0a0a0a; color:#f0f0f0; font:14px system-ui,sans-serif; }
  form { width:min(320px,92vw); padding:24px; border:1px solid #333; border-radius:8px; background:#141414; }
  h1 { margin:0 0 8px; font-size:18px; }
  p { margin:0 0 16px; color:#a3a3a3; line-height:1.5; }
  label { display:block; margin:12px 0 6px; color:#a3a3a3; }
  label:first-of-type { margin-top:0; }
  input { width:100%; padding:10px 12px; border:1px solid #333; border-radius:6px; background:#111; color:#f0f0f0; }
  button { width:100%; margin-top:16px; padding:10px 12px; border:0; border-radius:6px; background:#3b82f6; color:#fff; font:inherit; cursor:pointer; }
  button:hover { background:#2563eb; }
</style></head><body>
<form method="post" action="/auth">
  <h1>管理登录</h1>
  <p>${intro}</p>
  ${error}
  <label for="password">密码</label>
  <input id="password" name="password" type="password" autocomplete="current-password" required autofocus />
  ${totpField}
  <button type="submit">继续</button>
</form>
</body></html>`;
}

export async function issueGithubToken(env, origins, sessionSecret, extraHeaders = {}) {
  const token = env.GITHUB_TOKEN;
  if (!token) {
    return new Response("GITHUB_TOKEN 未配置", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const session = await createSession(sessionSecret);
  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Set-Cookie": sessionCookieHeader(session),
    ...extraHeaders,
  };

  return new Response(
    authResponse("github", "success", { token, provider: "github" }, origins),
    { headers }
  );
}