package com.arshilgenius.kisan.agriculture;

import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.util.ArrayList;

public class newsmain extends AppCompatActivity {

    private ConnectivityManager mConnectivityManager;
    private ListView mNewsList;
    private TextView setInfo;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.mainnews);
        setInfo=(TextView)findViewById(R.id.infoText);
        mNewsList = (ListView) findViewById(R.id.list_news);
        if (isNetworkConnected()) {
            TheGuardianRequest request = new TheGuardianRequest();
            request.execute("india+agriculture");
        }
        else {
            printInfo("No internet connection");
            return;
        }

        mNewsList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                News item = (News) mNewsList.getItemAtPosition(position);
                String url = item.getWebUrl();
                Intent i = new Intent(Intent.ACTION_VIEW);
                i.setData(Uri.parse(url));
                startActivity(i);
            }
        });

    }


    private void printInfo(String infoMessage) {
        setInfo.setVisibility(View.VISIBLE);
        setInfo.setText(infoMessage);
    }

    protected boolean isNetworkConnected() {

        if (mConnectivityManager == null) {
            mConnectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        }
        NetworkInfo networkInfo = mConnectivityManager.getActiveNetworkInfo();
        if (networkInfo != null && networkInfo.isConnected()) {
            return true;
        } else {
            return false;
        }
    }

    class TheGuardianRequest extends AsyncTask<String, Object, ArrayList<News>> {

        @Override
        protected ArrayList<News> doInBackground(String... strings) {
            // Stop if cancelled
            if (isCancelled()) {
                return null;
            }
            ArrayList<News> news = null;
            String apiUrlString = "http://content.guardianapis.com/search?q="
                    + strings[0] + "&format=json&api-key=test&show-fields=thumbnail";
            HttpURLConnection connection = null;
            // Build Connection.
            try {
                URL url = new URL(apiUrlString);
                connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");

                connection.setReadTimeout(10000); // 10 seconds
                connection.setConnectTimeout(10000); // 10 seconds

                int responseCode = connection.getResponseCode();
                if (responseCode != 200) {
                    Log.w(getClass().getName(),
                            "TheGuardian api request failed. Response Code: " + responseCode);
                    connection.disconnect();
                    return null;
                }

                StringBuilder builder = new StringBuilder();
                BufferedReader responseReader = new BufferedReader(
                        new InputStreamReader(connection.getInputStream()));
                String line = responseReader.readLine();
                while (line != null) {
                    builder.append(line);
                    line = responseReader.readLine();
                }
                String responseString = builder.toString();
                Log.d(getClass().getName(), "Response String: " + responseString);
                connection.disconnect();

                JSONObject responseJson = new JSONObject(responseString);
                Log.i(getClass().getName(), responseJson.toString());
                JSONObject response = responseJson.getJSONObject("response");
                JSONArray articles = response.getJSONArray("results");

                news = new ArrayList<>();

                for (int i = 0; i < articles.length(); i += 1) {
                    JSONObject currentArticle = articles.getJSONObject(i);
                    String title = currentArticle.getString("webTitle");
                    String section = currentArticle.getString("sectionName");
                    String webUrl = currentArticle.getString("webUrl");
                    JSONObject thumbNail = currentArticle.getJSONObject("fields");
                    String thumbnailurl = thumbNail.getString("thumbnail");

                    news.add(new News(section, title, webUrl,thumbnailurl));
                }
            } catch (MalformedURLException e) {
                Log.i(getClass().getName(), e.getMessage());
            } catch (ProtocolException e) {
                Log.i(getClass().getName(), e.getMessage());
            } catch (IOException e) {
                Log.i(getClass().getName(), e.getMessage());
            } catch (JSONException e) {
                Log.i(getClass().getName(), e.getMessage());
            }
            return news;
        }

        @Override
        protected void onPostExecute(ArrayList<News> news) {
            if (news == null || news.size() == 0) {
                mNewsList.setVisibility(View.GONE);
                Log.i(getClass().getName(), "News is null");
                return;
            } else {
                mNewsList.setVisibility(View.VISIBLE);
                mNewsList.setAdapter(new NewsAdapter(newsmain.this, news));
                mNewsList.invalidateViews();
            }
        }
    }
}
