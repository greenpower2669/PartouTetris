package com.greenpower2669.partouteris;

import android.app.Activity;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import javax.net.ssl.HttpsURLConnection;

/**
 * Fixed-origin Hall of Fame bridge (SpaceFortress / GeckoDoku pattern).
 * No API credentials embedded in an APK. The server must separately enable
 * /api/v1/games/partoutetris/{scores,sync}; 404 is explicitly reported to JS.
 */
public final class PartouHallApiBridge {
    private static final String BASE =
        "https://fab-hall-of-fame.gnrationsia.chatgpt.site/api/v1/games/partoutetris";
    private final Activity activity;
    private final WebView webView;
    private final ExecutorService executor = Executors.newSingleThreadExecutor(r -> {
        Thread t = new Thread(r, "PartouHall-Sync");
        t.setDaemon(true);
        return t;
    });

    public PartouHallApiBridge(Activity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;
    }

    @JavascriptInterface
    public void post(String payload, String requestId) {
        if (payload == null || payload.length() > 32000 || !validId(requestId)) return;
        executor.execute(() -> request("POST", BASE + "/scores", payload, requestId));
    }

    @JavascriptInterface
    public void sync(String cursor, String requestId) {
        if (!validId(requestId) || cursor == null || cursor.length() > 256) return;
        try {
            String query = "?cursor=" + URLEncoder.encode(cursor, "UTF-8") + "&limit=100";
            executor.execute(() -> request("GET", BASE + "/sync" + query, null, requestId));
        } catch (Exception ignored) {
            reply(requestId, 0, "");
        }
    }

    private boolean validId(String id) {
        return id != null && id.matches("h[0-9]{1,8}");
    }

    private void request(String method, String endpoint, String body, String requestId) {
        HttpsURLConnection conn = null;
        try {
            conn = (HttpsURLConnection)new URL(endpoint).openConnection();
            conn.setRequestMethod(method);
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(10000);
            conn.setUseCaches(false);
            conn.setRequestProperty("Accept", "application/json");
            if (body != null) {
                byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
                conn.setRequestProperty("Content-Type", "application/json; charset=utf-8");
                conn.setFixedLengthStreamingMode(bytes.length);
                conn.setDoOutput(true);
                try (OutputStream out = conn.getOutputStream()) {
                    out.write(bytes);
                }
            }
            int status = conn.getResponseCode();
            try (InputStream stream = status >= 400 ? conn.getErrorStream() : conn.getInputStream()) {
                if (stream == null) { reply(requestId, status, "");return; }
                ByteArrayOutputStream output = new ByteArrayOutputStream();
                byte[] buf = new byte[4096];int n;
                while ((n = stream.read(buf)) > -1) {
                    if (output.size() + n > 1024 * 1024) {
                        reply(requestId, 0, "");return;
                    }
                    output.write(buf, 0, n);
                }
                reply(requestId, status, new String(output.toByteArray(), StandardCharsets.UTF_8));
            }
        } catch (Exception e) {
            reply(requestId, 0, "");
        } finally {
            if (conn != null) conn.disconnect();
        }
    }

    private void reply(String id, int status, String body) {
        if (!validId(id)) return;
        final String js = "window.partouHallReply&&window.partouHallReply(" +
            JSONObject.quote(id) + "," + status + "," + JSONObject.quote(body) + ")";
        activity.runOnUiThread(() -> {
            try { webView.evaluateJavascript(js, null); }
            catch (RuntimeException ignored) { }
        });
    }

    public void shutdown() {
        executor.shutdownNow();
    }
}
