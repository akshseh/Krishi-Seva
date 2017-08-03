package com.arshilgenius.kisan.agriculture;

import android.app.Application;
import android.content.res.Configuration;

import net.gotev.speech.Speech;

/**
 * Created by humra on 2/22/2017.
 */
public class MyApplication extends Application {

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Speech.init(this);
    }



}