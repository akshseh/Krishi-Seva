package com.arshilgenius.kisan.agriculture;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;

import com.nightonke.boommenu.BoomButtons.ButtonPlaceEnum;
import com.nightonke.boommenu.BoomButtons.HamButton;
import com.nightonke.boommenu.BoomButtons.OnBMClickListener;
import com.nightonke.boommenu.BoomMenuButton;
import com.nightonke.boommenu.ButtonEnum;
import com.nightonke.boommenu.Piece.PiecePlaceEnum;

import java.text.DateFormat;
import java.util.Date;

import me.itangqi.waveloadingview.WaveLoadingView;


public class menuscreen extends ActionBarActivity {
    static int[] imageResources = new int[]{
            R.drawable.robot,
            R.drawable.news,
            R.drawable.cloudy,
            R.drawable.smartphone,
            R.drawable.cart,



    };
    static int[] Strings = new int[]{
            R.string.voice,
            R.string.news,
            R.string.weather,
            R.string.forum,
            R.string.buy,




    };

    static int imageResourceIndex = 0;
    static int str = 0;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menuscreen);
        String currentDateTimeString = DateFormat.getDateTimeInstance().format(new Date());
       // Toast.makeText(this, currentDateTimeString, Toast.LENGTH_LONG).show();;

        WaveLoadingView mWaveLoadingView = (WaveLoadingView) findViewById(R.id.waveLoadingView);
        mWaveLoadingView.setShapeType(WaveLoadingView.ShapeType.CIRCLE);

        mWaveLoadingView.setCenterTitleColor(Color.GRAY);
        mWaveLoadingView.setBottomTitleSize(18);
        mWaveLoadingView.setProgressValue(20);
        mWaveLoadingView.setBorderWidth(0);
        mWaveLoadingView.setAmplitudeRatio(60);
        mWaveLoadingView.setWaveColor(Color.parseColor("#ff64c2f4"));
        mWaveLoadingView.setTopTitleStrokeColor(Color.parseColor("#ff1ca8f4"));
        mWaveLoadingView.setTopTitleStrokeWidth(3);
        mWaveLoadingView.setAnimDuration(6000);
        mWaveLoadingView.pauseAnimation();
        mWaveLoadingView.resumeAnimation();
        mWaveLoadingView.cancelAnimation();
        mWaveLoadingView.startAnimation();

       bmb();

    }

  /*  public  void in()
    {

        WaveLoadingView mWaveLoadingView = (WaveLoadingView) findViewById(R.id.waveLoadingView);
        mWaveLoadingView.setShapeType(WaveLoadingView.ShapeType.CIRCLE);
        mWaveLoadingView.setTopTitle("Top Title");
        mWaveLoadingView.setCenterTitleColor(Color.GRAY);
        mWaveLoadingView.setBottomTitleSize(18);
        mWaveLoadingView.setProgressValue(80);
        mWaveLoadingView.setBorderWidth(10);
        mWaveLoadingView.setAmplitudeRatio(60);
        mWaveLoadingView.setWaveColor(Color.GRAY);
        mWaveLoadingView.setBorderColor(Color.GRAY);
        mWaveLoadingView.setTopTitleStrokeColor(Color.BLUE);
        mWaveLoadingView.setTopTitleStrokeWidth(3);
        mWaveLoadingView.setAnimDuration(6000);
        mWaveLoadingView.pauseAnimation();
        mWaveLoadingView.resumeAnimation();
        mWaveLoadingView.cancelAnimation();
        mWaveLoadingView.startAnimation();

    }*/
    public void bmb()
    {
        BoomMenuButton bmb = (BoomMenuButton) findViewById(R.id.bmb);
        bmb.setButtonEnum(ButtonEnum.Ham);
        bmb.setPiecePlaceEnum(PiecePlaceEnum.HAM_5);
        bmb.setButtonPlaceEnum(ButtonPlaceEnum.HAM_5);
        for (int i = 0; i < bmb.getPiecePlaceEnum().pieceNumber(); i++) {
            HamButton.Builder builder = new HamButton.Builder()
                    .normalTextRes(getString())
                    .listener(new OnBMClickListener() {
                        @Override
                        public void onBoomButtonClick(int index) {


                            if (index == 0) {
                                start(index);

                            }
                            if (index == 1) {
                                orderingg(index);
                            }
                            if (index == 2) {
                                stock(index);

                            }
                            if (index == 3) {
                                sales(index);
                            }
                            if (index == 4) {
                                buy(index);
                            }
                        }
                    })

                    .normalImageRes(getImageResource());
            bmb.addBuilder(builder);
        }
    }
    public static int getString() {
        if (str >= Strings.length) str = 0;
        return Strings[str++];
    }
    public static int getImageResource() {
        if (imageResourceIndex >= imageResources.length) imageResourceIndex = 0;
        return imageResources[imageResourceIndex++];
    }
    public void start(int pos)
    {
        //   Toast.makeText(this, Integer.toString(pos), Toast.LENGTH_LONG).show();
        Intent in = new Intent( this, MainActivity.class);
        startActivity(in);
    }
    public void stock(int pos)
    {
        //   Toast.makeText(this, Integer.toString(pos), Toast.LENGTH_LONG).show();
        Intent in = new Intent( this, sunmain.class);
        startActivity(in);
    }
    public void sales(int pos)
    {
        //   Toast.makeText(this, Integer.toString(pos), Toast.LENGTH_LONG).show();
        Intent in = new Intent( this, forum.class);
        startActivity(in);
    }
    public void buy(int pos)
    {
        //   Toast.makeText(this, Integer.toString(pos), Toast.LENGTH_LONG).show();
        Intent in = new Intent( this, orders.class);
        startActivity(in);
    }

    public void orderingg(int pos)
    {
        // Toast.makeText(this, Integer.toString(pos), Toast.LENGTH_LONG).show();
        Intent in = new Intent( this, newsmain.class);
        startActivity(in);
    }

}
