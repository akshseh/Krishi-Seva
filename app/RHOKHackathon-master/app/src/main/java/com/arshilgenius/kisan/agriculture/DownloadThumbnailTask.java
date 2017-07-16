package com.arshilgenius.kisan.agriculture;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;

import java.io.InputStream;

/**
 * Created by macbookair on 01/07/16.
 */
public class DownloadThumbnailTask extends AsyncTask<String, Void, Bitmap> {
    private final static String TAG = DownloadThumbnailTask.class.getSimpleName();

    ImageView thumbnail;

    DownloadThumbnailTask(ImageView imageView) {
        thumbnail = imageView;
    }

    @Override protected Bitmap doInBackground(String... params) {
        if (params == null) return null;
        Bitmap imageBitmap = downloadImageBitmap(params[0]);
        return imageBitmap;
    }

    @Override protected void onPostExecute(Bitmap bmp) {
        if (thumbnail != null) {
            if (bmp != null) {
                thumbnail.setImageBitmap(bmp);
            } else {
                thumbnail.setVisibility(View.GONE);
            }
        }
    }

    public Bitmap downloadImageBitmap(String imageUrl) {
        if (imageUrl == null || imageUrl.length() == 0) {
            Log.i(TAG,
                    "Image Url is Null.");
            return null;
        }
        Bitmap bitmap = null;
        try {
            InputStream inputStream = new java.net.URL(imageUrl).openStream();
            bitmap = BitmapFactory.decodeStream(inputStream);
            if (inputStream != null) {
                inputStream.close();
            }
        } catch (Exception e) {
            Log.e(TAG,
                    String.format("Thumbnail Download Exception: %s.", imageUrl), e);
        }
        return bitmap;
    }
}
