package com.arshilgenius.kisan.agriculture;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;

/**
 * Created by macbookair on 30/06/16.
 */
public class NewsAdapter extends ArrayAdapter<News> {
    public NewsAdapter(Context context, ArrayList<News> books) {
        super(context, 0, books);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View listItemView = convertView;
        if (listItemView == null) {
            listItemView = LayoutInflater.from(getContext()).inflate(
                    R.layout.news_list, parent, false);
        }


        News currNews = getItem(position);


        TextView authorTextView = (TextView) listItemView.findViewById(R.id.section);

        authorTextView.setText(currNews.getSection());


        TextView titleTextView = (TextView) listItemView.findViewById(R.id.title);

        titleTextView.setText(currNews.getTitle());
        ImageView imageView = (ImageView) listItemView.findViewById(R.id.article_thumbnail);
        String tempThumbnail = currNews.getThumbNailUrl();
        if (tempThumbnail != null && !tempThumbnail.equals("")) {
            new DownloadThumbnailTask(imageView).execute(tempThumbnail);
        }


        return listItemView;
    }
}
