function authResponse(provider, status, content, origins) {
  const allowed = JSON.stringify(origins.split(",").map((o) => o.trim()));
  const payload = JSON.stringify(content);

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>登录中…</title></head><body>
<script>
(function() {
  var origins = ${allowed};
  function hostMatches(origin) {
    var host = origin.replace(/^https?:\\/\\//, "");
    return origins.some(function(item) {
      if (item.indexOf("*") >= 0) {
        var regex = new RegExp("^" + item.replace(/\\./g, "\\\\.").replace(/\\*/g, "[\\\\w.-]+") + "$");
        return regex.test(host);
      }
      return item === host;
    });
  }
  function onMessage(event) {
    if (!hostMatches(event.origin)) return;
    window.opener.postMessage(
      "authorization:${provider}:${status}:${payload}",
      event.origin
    );
  }
  window.addEventListener("message", onMessage, false);
  if (window.opener) {
    window.opener.postMessage("authorizing:${provider}", "*");
  } else {
    document.body.innerHTML = "<p>请从后台页面重新打开登录窗口。</p>";
  }
})();
</script></body></html>`;
}

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const origins = env.ALLOWED_ORIGIN || "quna.fun,www.quna.fun";

  if (!code) {
    return new Response(authResponse("github", "error", { error: "missing_code" }, origins), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new Response(authResponse("github", "error", { error: "oauth_not_configured" }, origins), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const redirectUri = `${url.origin}/callback`;
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "Key-Blog-CMS",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenRes.json();
  if (tokenData.error || !tokenData.access_token) {
    return new Response(
      authResponse(
        "github",
        "error",
        { error: tokenData.error_description || tokenData.error || "token_error" },
        origins
      ),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  return new Response(
    authResponse("github", "success", { token: tokenData.access_token, provider: "github" }, origins),
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}