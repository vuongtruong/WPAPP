package com.wpapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.toast.RCTToastPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import cl.json.RNSharePackage;
import cl.json.ShareApplication;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication, ShareApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RCTToastPackage(),
            new SplashScreenReactPackage(),
            new ReactNativeYouTube(),
              new RNSharePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    if (BuildConfig.DEBUG) {
      StethoWrapper.initialize(this);
      StethoWrapper.addInterceptor();
    }

    SoLoader.init(this, /* native exopackage */ false);
  }

  public String getFileProviderAuthority() {
    return "com.wpapp";
  }
}
