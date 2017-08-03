package com.arshilgenius.kisan.agriculture;

import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;

import com.firebase.client.DataSnapshot;
import com.firebase.client.Firebase;
import com.firebase.client.FirebaseError;
import com.firebase.client.ValueEventListener;

import co.intentservice.chatui.ChatView;
import co.intentservice.chatui.models.ChatMessage;


public class forum extends ActionBarActivity {
    ChatView chatView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forum);
        Firebase.setAndroidContext(this);
        chatView = (ChatView) findViewById(R.id.chat_view);
      read();


        chatView.setOnSentMessageListener(new ChatView.OnSentMessageListener(){
            @Override
            public boolean sendMessage(ChatMessage chatMessage){
                Firebase ref = new Firebase("https://adaa-45b17.firebaseio.com/FORUMS/");
                foru person = new foru();

                person.setPost(chatMessage.getMessage());
                ref.push().setValue(person);

                return true;
            }
        });
    }
    public void read()
    {

        final Firebase ref = new Firebase("https://adaa-45b17.firebaseio.com/FORUMS/");
        //Value event listener for realtime data update

        ref.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot usersSnapshot) {

                for (DataSnapshot userSnapshot : usersSnapshot.getChildren()) {
                    foru user = userSnapshot.getValue(foru.class);

                   String post = user.getPost().toString();
                    chatView.addMessage(new ChatMessage(post, System.currentTimeMillis(), ChatMessage.Type.RECEIVED));

                }

            }

            @Override
            public void onCancelled(FirebaseError firebaseError) {
                System.out.println("The read failed: " + firebaseError.getMessage());
            }
        });

    }



}
