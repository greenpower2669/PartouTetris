package com.greenpower2669.partouteris;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.util.Log;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public final class MainActivity extends Activity {
    private WebView webView;
    private PartouHallApiBridge hallBridge;
    private void immersive() {
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
            View.SYSTEM_UI_FLAG_FULLSCREEN |
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    }
    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        getWindow().addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        immersive();
        webView=new WebView(this);
        webView.setBackgroundColor(0xff060d1c);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setWebViewClient(new WebViewClient());
        // Debug-only gameplay traces, without flooding Android system logs.
        webView.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onConsoleMessage(ConsoleMessage message) {
                if (message.message() != null && message.message().startsWith("[PT020][POSE]")) {
                    Log.d("PartouChirality", message.message());
                    return true;
                }
                if (message.message() != null && message.message().startsWith("[PT021][BOOST]")) {
                    Log.d("PartouTouch", message.message());
                    return true;
                }
                if (message.message() != null && message.message().startsWith("[PT024][SCORE]")) {
                    Log.d("PartouScore", message.message());
                    return true;
                }
                return super.onConsoleMessage(message);
            }
        });
        configure(webView.getSettings());
        // A JavaScript bridge is safe only while WebView remains in our
        // bundled, trusted appassets. Reject navigations to foreign pages.
        hallBridge = new PartouHallApiBridge(this, webView);
        webView.addJavascriptInterface(hallBridge, "PartouHall");
        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(
                    WebView view, android.webkit.WebResourceRequest request) {
                String url = request.getUrl().toString();
                return !url.startsWith("file:///android_asset/");
            }
        });
        setContentView(webView);
        webView.loadUrl("file:///android_asset/index.html");
    }
    @SuppressLint("SetJavaScriptEnabled")
    private void configure(WebSettings s) {
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(false);
        s.setAllowFileAccessFromFileURLs(false);
        s.setAllowUniversalAccessFromFileURLs(false);
        s.setMediaPlaybackRequiresUserGesture(true);
    }
    @Override public void onWindowFocusChanged(boolean focus) {
        super.onWindowFocusChanged(focus);
        if(focus) immersive();
    }
    @Override protected void onPause() {
        // Flush JavaScript state while WebView is still available; an
        // independent 850ms checkpoint already protects abrupt process kills.
        if (webView != null) {
            webView.evaluateJavascript(
                "window.partouFlushSession&&window.partouFlushSession()", null);
        }
        super.onPause();
    }
    @Override protected void onDestroy() {
        if(hallBridge!=null){hallBridge.shutdown();hallBridge=null;}
        if(webView!=null){webView.stopLoading();webView.destroy();webView=null;}
        super.onDestroy();
    }
}
