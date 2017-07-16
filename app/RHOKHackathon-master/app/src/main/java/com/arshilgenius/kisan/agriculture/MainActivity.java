package com.arshilgenius.kisan.agriculture;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.google.gson.JsonElement;

import net.gotev.speech.Speech;

import java.util.Map;

import ai.api.AIListener;
import ai.api.android.AIConfiguration;
import ai.api.android.AIService;
import ai.api.model.AIError;
import ai.api.model.AIResponse;
import ai.api.model.Result;

public class MainActivity extends ActionBarActivity implements AIListener {
    private Button listenButton;
    private TextView resultTextView;
    private AIService aiService;
    private static String TAG = "PermissionDemo";
    private static final int RECORD_REQUEST_CODE = 101;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        listenButton = (Button) findViewById(R.id.listenButton);
        resultTextView = (TextView) findViewById(R.id.resultTextView);
        final AIConfiguration config = new AIConfiguration("1e03efe2dfdc4a37a3e21e5d1056a4ec",
                AIConfiguration.SupportedLanguages.English,
                AIConfiguration.RecognitionEngine.System);

        int permission = ContextCompat.checkSelfPermission(this,
                Manifest.permission.RECORD_AUDIO);

        if (permission != PackageManager.PERMISSION_GRANTED) {
            Log.i(TAG, "Permission to record denied");
            makeRequest();
        }
        aiService = AIService.getService(this, config);
        aiService.setListener(this);
    }
    protected void makeRequest() {
        ActivityCompat.requestPermissions(this,
                new String[]{Manifest.permission.RECORD_AUDIO},
                RECORD_REQUEST_CODE);
    }
    public void listenButtonOnClick(final View view) {
        aiService.startListening();
    }
    public void onResult(final AIResponse response) {
        Result result = response.getResult();


        // Get parameters
        String parameterString = "";
        if (result.getParameters() != null && !result.getParameters().isEmpty()) {
            for (final Map.Entry<String, JsonElement> entry : result.getParameters().entrySet()) {
                parameterString += "(" + entry.getKey() + ", " + entry.getValue() + ") ";
            }
        }

        // Show results in TextView.
        resultTextView.setText(
               /* "\nAction: " + result.getAction() +*/
                "Solution To Your Problem:\n\n" + result.getFulfillment().getSpeech());
        Speech.getInstance().say(result.getFulfillment().getSpeech());
    }
    @Override
    public void onError(final AIError error) {
        resultTextView.setText(error.toString());
    }
    @Override
    public void onListeningStarted() {}

    @Override
    public void onListeningCanceled() {}

    @Override
    public void onListeningFinished() {}

    @Override
    public void onAudioLevel(final float level) {}
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }
    @Override
    public void onBackPressed() {
        Speech.getInstance().say("Bye");
       Speech.getInstance().unregisterDelegate();
        super.onBackPressed();
    }

}
