package com.example.TicketingNS;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // FULLSCREEN IMMERSIVE
        enableFullScreen();

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);

        // 🔥 PENTING: SETTING YANG BENAR UNTUK MENCEGAH WEBVIEW MEMBESAR
        settings.setUseWideViewPort(true);        // biar width mengikuti viewport HTML
        settings.setLoadWithOverviewMode(false);  // JANGAN overview (bikin auto-zoom)
        webView.setInitialScale(0);               // scale otomatis sesuai DPI

        // OPSIONAL: Hindari zoom manual
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        webView.setWebChromeClient(new WebChromeClient());

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                enableFullScreen(); // tetap immersive
                super.onPageFinished(view, url);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                // reload otomatis jika error
                view.postDelayed(() -> view.loadUrl("file:///android_asset/index.html"), 2000);
            }
        });

        // LOAD LOCAL FILE
        webView.loadUrl("file:///android_asset/index.html");
    }

    private void enableFullScreen() {
        View decor = getWindow().getDecorView();
        decor.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_FULLSCREEN |
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) enableFullScreen();
    }

    @Override
    public void onBackPressed() {
        // Disable tombol back
    }
}
