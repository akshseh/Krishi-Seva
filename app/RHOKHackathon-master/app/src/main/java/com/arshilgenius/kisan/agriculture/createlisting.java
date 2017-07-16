package com.arshilgenius.kisan.agriculture;

import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import com.firebase.client.Firebase;

import cn.pedant.SweetAlert.SweetAlertDialog;


public class createlisting extends ActionBarActivity {
    String selected = "";
    EditText ed;
    EditText ed2;
    EditText ed3;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_createlisting);
        ed = (EditText) findViewById(R.id.fname);
        ed2 = (EditText) findViewById(R.id.lname);
        ed3 = (EditText) findViewById(R.id.cname);
        Firebase.setAndroidContext(this);
    }

    public void c(View view) {
        String amount = ed.getText().toString();
        String kg = ed2.getText().toString();
        String loc = ed3.getText().toString();
        if(selected.equals(""))
        {
            new SweetAlertDialog(this, SweetAlertDialog.ERROR_TYPE)
                    .setTitleText("Oops...")
                    .setContentText("You Did Not Enter The Amount")
                    .show();
        }
        else
        {
           String  url="https://adaa-45b17.firebaseio.com/ORDERS";
            Firebase ref = new Firebase(url);
            ordering order = new ordering();

          order.setAmount(amount);
            order.setKgs(kg);
            order.setCrop(selected);
            order.setLat("9.9312");
            order.setLongg("76.2673");
            order.setLoc(loc);
            ref.push().setValue(order);
        }
    }


    public void im1(View view) {
        selected = "rice";
    }

    public void im2(View view) {
        selected = "corn";
    }

    public void im3(View view) {
        selected = "wheat";
    }
}
