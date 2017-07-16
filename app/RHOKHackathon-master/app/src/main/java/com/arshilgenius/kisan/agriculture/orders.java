package com.arshilgenius.kisan.agriculture;

import android.content.Intent;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.View;

import com.firebase.client.DataSnapshot;
import com.firebase.client.Firebase;
import com.firebase.client.FirebaseError;
import com.firebase.client.ValueEventListener;

import java.util.ArrayList;

import it.gmariotti.cardslib.library.internal.Card;
import it.gmariotti.cardslib.library.internal.CardArrayAdapter;
import it.gmariotti.cardslib.library.internal.CardHeader;
import it.gmariotti.cardslib.library.internal.CardThumbnail;
import it.gmariotti.cardslib.library.view.CardListView;


public class orders extends ActionBarActivity {
    ArrayList<Card> cards = new ArrayList<Card>();
    ArrayList<String> amountt = new ArrayList<String>();
    ArrayList<String> cropp = new ArrayList<String>();
    ArrayList<String> latt = new ArrayList<String>();
    ArrayList<String> longgg = new ArrayList<String>();
    ArrayList<String> kg = new ArrayList<String>();
    ArrayList<String> location = new ArrayList<String>();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_orders);
        Firebase.setAndroidContext(this);
        read();

    }
    public void read()
    {
        final Firebase ref = new Firebase("https://adaa-45b17.firebaseio.com/ORDERS");
        //Value event listener for realtime data update


        ref.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot usersSnapshot) {

                for (DataSnapshot userSnapshot : usersSnapshot.getChildren()) {
                    ordering forums = userSnapshot.getValue(ordering.class);
                    String amount = forums.getAmount().toString();
                    String crop = forums.getCrop().toString();
                    String lat = forums.getLat();
                    String longg = forums.getLongg();
                    String kgs= forums.getKgs();
                    String l= forums.getLoc();
                    location.add(l);
                    amountt.add(amount);
                    cropp.add(crop);
                    latt.add(lat);
                    longgg.add(longg);
                    kg.add(kgs);

                }
                cardpop();
            }

            @Override
            public void onCancelled(FirebaseError firebaseError) {
                System.out.println("The read failed: " + firebaseError.getMessage());
            }
        });

    }

    public void cardpop()
    {
        for(int i=0;i<amountt.size();i++)
        {
            Card card = new Card(getApplicationContext());
            final String amount= amountt.get(i);
            final String crop=cropp.get(i);
            final String lat= latt.get(i);
            final String longg= longgg.get(i);
            final String kgss= kg.get(i);
            String locc= location.get(i);


            String s= "Crop Name: "+ crop+"\nAmount: "+amount+"\nKiloGrams Available: "+kgss+"\nLocation: "+locc;
            // blah(s);
            //Create a CardHeader
            CardHeader header = new CardHeader(getApplicationContext());
            header.setTitle(crop.toUpperCase());
            card.setTitle(s);
            //Add Header to card
           // card.setBackgroundResourceId(R.color.colorAccent);

           CardThumbnail thumb = new CardThumbnail(getApplicationContext());

            //Set ID resource
            if(crop.equals("corn"))
          thumb.setDrawableResource(R.drawable.corn);
            else if(crop.equals("rice"))
                thumb.setDrawableResource(R.drawable.rice);
            else
                thumb.setDrawableResource(R.drawable.wheat);
//
       // Add thumbnail to a card
       //
       //
       card.addCardThumbnail(thumb);
            //header.setOtherButtonVisible(true);
            //header.setOtherButtonDrawable(R.drawable.pencil);
            //Add a callback
            card.setOnClickListener(new Card.OnCardClickListener() {
                @Override
                public void onClick(Card card, View view) {

                    Intent in = new Intent(orders.this, MapsActivity.class);
                    in.putExtra("lat",lat);
                    in.putExtra("long",longg);
                    startActivity(in);
                }
            });
            card.addCardHeader(header);
            cards.add(card);
        }
        CardArrayAdapter mCardArrayAdapter = new CardArrayAdapter(getApplicationContext(),cards);

        CardListView listView = (CardListView) findViewById(R.id.myList);
        if (listView!=null){
            listView.setAdapter(mCardArrayAdapter);
        }
    }
}
