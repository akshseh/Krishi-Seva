$(document).ready(function(){
  $(".button-collapse").sideNav();
});


function submitLogin(){
  var data={
    username:$("#user-phone").val(),
    password:$("#user-password").val()
  }
  var submitUrl={
    "farmer":"/farmer/login",
    "admin":"/admin/login"
  }
  var url=submitUrl[$('input[name="user-type"]:checked').val()];
  $.ajax({
    url:url,
    type:'post',
    data:data,
    success:function(response){
      console.log(response);
      if(response.success==true){
        $("#alert-text").html("Logged in!");
        $("#alert-text").css('color','#7e7');
        setTimeout(function(){
          window.location.href=(response.redir)?(response.redir):('/');
        },500);
      }
      else{
        if(response.message)
          $("#alert-text").html(response.message);
        else
          $("#alert-text").html("Couldn't login");
        $("#alert-text").css('color','#f77');
        $("#login-button").attr("disabled",false);
      }      
    },
    error:function(response){
      if(response.message)
        $("#alert-text").html(response.message);
      else
        $("#alert-text").html("Couldn't login");
      $("#alert-text").css('color','#f77');
      $("#login-button").attr("disabled",false);
    }
  });
}

function submitReg(){
  var data={
    name:$("#user-name").val(),
    phone:$("#user-phone").val(),
    address:$("#user-address").val(),
    password:$("#user-password").val()
  }
  $.ajax({
    url:'/register',
    type:'post',
    data:data,
    success:function(response){
      if(response.success==true){
        $("#alert-text").html("Registered!");
        $("#alert-text").css('color','#7e7');
        setTimeout(function(){
          window.location.href=(response.redir)?(response.redir):('/');
        },500);
      }
      else{
        if(response.message)
          $("#alert-text").html(response.message);
        else
          $("#alert-text").html("Couldn't login");
        $("#alert-text").css('color','#f77');
        $("#login-button").attr("disabled",false);
      }      
    },
    error:function(response){
      if(response.message)
        $("#alert-text").html(response.message);
      else
        $("#alert-text").html("Couldn't login");
      $("#alert-text").css('color','#f77');
      $("#login-button").attr("disabled",false);
    }
  });
}