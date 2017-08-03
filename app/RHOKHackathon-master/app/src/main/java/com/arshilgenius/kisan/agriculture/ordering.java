package com.arshilgenius.kisan.agriculture;

/**
 * Created by humra on 2/10/2017.
 */
public class ordering {

  private String amount;
    private String crop;
    private String lat;
    private String longg;
private String kgs;
    private String loc;



    long stackId;
    public ordering() {
      /*Blank default constructor essential for Firebase*/
    }
    public ordering(String a)
    {

    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getCrop() {
        return crop;
    }

    public void setCrop(String crop) {
        this.crop = crop;
    }

    public String getLat() {
        return lat;
    }

    public void setLat(String lat) {
        this.lat = lat;
    }

    public String getLongg() {
        return longg;
    }

    public void setLongg(String longg) {
        this.longg = longg;
    }

    public String getKgs() {
        return kgs;
    }

    public void setKgs(String kgs) {
        this.kgs = kgs;
    }

    public String getLoc() {
        return loc;
    }

    public void setLoc(String loc) {
        this.loc = loc;
    }


    //Getters and setters

}

