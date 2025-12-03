package com.example.TicketingNS;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.os.Bundle;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.appcompat.app.AppCompatActivity;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        enableFullScreen();

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);

        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(false);
        webView.setInitialScale(0);

        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);

        webView.setWebChromeClient(new WebChromeClient());

        // **Tambahkan Interface untuk akses printer**
        webView.addJavascriptInterface(new AndroidPrint(this), "AndroidPrint");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                enableFullScreen();
                super.onPageFinished(view, url);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                view.postDelayed(() -> view.loadUrl("file:///android_asset/index.html"), 2000);
            }
        });

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

    // ============================================================
    //                  PRINTER JAVASCRIPT INTERFACE
    // ============================================================

    public class AndroidPrint {
        Context ctx;

        AndroidPrint(Context c) {
            ctx = c;
        }

        // ============================
        // PRINT TEKS ESC/POS KE PRINTER LAN
        // ============================
        @JavascriptInterface
        public void printText(String data, String ip, String portStr) {
            try {
                int port = Integer.parseInt(portStr);

                Socket socket = new Socket();
                socket.connect(new InetSocketAddress(ip, port), 3000);

                OutputStream os = socket.getOutputStream();
                os.write(data.getBytes("UTF-8"));
                os.flush();

                os.close();
                socket.close();

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // ============================
        // PRINT GAMBAR BASE64 (LOGO) - tetap disimpan jika diperlukan
        // ============================
        @JavascriptInterface
        public void printImage(String base64) {
            try {
                // decode base64 PNG
                byte[] decoded = Base64.decode(base64, Base64.DEFAULT);
                Bitmap bmp = BitmapFactory.decodeByteArray(decoded, 0, decoded.length);

                if (bmp == null) return;

                // convert ke ESC/POS bitmap
                byte[] escpos = Utils.decodeBitmap(bmp);
                sendImageRaw(escpos);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // ============================
        // PRINT LOGO LANGSUNG DARI ASSETS (TANPA BASE64 / TANPA CANVAS)
        // Dipanggil dari JS: AndroidPrint.printLogo()
        // ============================
        @JavascriptInterface
        public void printLogo() {
            try {
                // buka file dari assets/img/logo2.png
                InputStream is = ctx.getAssets().open("img/logo2.png");
                Bitmap bmp = BitmapFactory.decodeStream(is);
                is.close();

                if (bmp == null) return;

                // convert ke ESC/POS bitmap (raster)
                byte[] escpos = Utils.decodeBitmap(bmp);

                // kirim data ke printer
                sendImageRaw(escpos);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        private void sendImageRaw(byte[] imgData) {
            try {
                String ip = webView.getContext()
                        .getSharedPreferences("prefs", MODE_PRIVATE)
                        .getString("printer", "");

                String portStr = webView.getContext()
                        .getSharedPreferences("prefs", MODE_PRIVATE)
                        .getString("portPrinter", "9100");

                if (ip == null || ip.isEmpty()) return;

                int port = Integer.parseInt(portStr);

                Socket socket = new Socket();
                socket.connect(new InetSocketAddress(ip, port), 3000);

                OutputStream os = socket.getOutputStream();
                os.write(imgData);
                os.flush();

                os.close();
                socket.close();

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
