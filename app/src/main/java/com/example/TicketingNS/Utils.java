package com.example.TicketingNS;

import android.graphics.Bitmap;

public class Utils {
    public static byte[] decodeBitmap(Bitmap bmp) {
        // versi pendek ESC/POS (compat semua printer minipos)
        int width = bmp.getWidth();
        int height = bmp.getHeight();

        int bytesPerLine = (width + 7) / 8;
        byte[] data = new byte[8 + (bytesPerLine * height)];

        int offset = 0;

        // header print raster image
        data[offset++] = 0x1D;
        data[offset++] = 0x76;
        data[offset++] = 0x30;
        data[offset++] = 0x00;
        data[offset++] = (byte) (bytesPerLine & 0xFF);
        data[offset++] = (byte) ((bytesPerLine >> 8) & 0xFF);
        data[offset++] = (byte) (height & 0xFF);
        data[offset++] = (byte) ((height >> 8) & 0xFF);

        for (int y = 0; y < height; y++) {
            for (int xByte = 0; xByte < bytesPerLine; xByte++) {
                int byteVal = 0;

                for (int bit = 0; bit < 8; bit++) {
                    int x = xByte * 8 + bit;

                    if (x < width) {
                        int pixel = bmp.getPixel(x, y);
                        int r = (pixel >> 16) & 0xFF;
                        int g = (pixel >> 8) & 0xFF;
                        int b = pixel & 0xFF;

                        int luminance = (r + g + b) / 3;
                        if (luminance < 128) {
                            byteVal |= (1 << (7 - bit));
                        }
                    }
                }

                data[offset++] = (byte) byteVal;
            }
        }

        return data;
    }
}
