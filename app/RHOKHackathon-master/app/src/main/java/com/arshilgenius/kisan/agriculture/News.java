package com.arshilgenius.kisan.agriculture;

/**
 * Created by macbookair on 30/06/16.
 */
public class News {
    private String mSection;
    private String mTitle;
    private String mWebUrl;
    private String mThumbNailUrl;

    public News(String section, String title, String WebUrl,String ThumbNaialUrl) {
        mSection = section;
        mTitle = title;
        mWebUrl = WebUrl;
       mThumbNailUrl = ThumbNaialUrl;
    }

    public String getSection()
    {
        return mSection;
    }

    public String getTitle()
    {
        return mTitle;
    }

    public String getWebUrl()
    {
        return mWebUrl;
    }

    public String getThumbNailUrl()
    {
       return mThumbNailUrl;
    }
}
