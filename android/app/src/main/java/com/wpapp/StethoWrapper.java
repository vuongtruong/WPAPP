package com.wpapp;

import android.content.Context;

import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.stetho.Stetho;
import com.facebook.stetho.okhttp3.StethoInterceptor;

import okhttp3.OkHttpClient;

/**
 * Created by tannn on 5/7/2018.
 */

public class StethoWrapper {
    public static void initialize(Context context) {
        Stetho.initializeWithDefaults(context);
    }

    public static void addInterceptor() {
        OkHttpClient client = OkHttpClientProvider.getOkHttpClient()
                .newBuilder()
                .addNetworkInterceptor(new StethoInterceptor())
                .build();

        OkHttpClientProvider.replaceOkHttpClient(client);
    }
}