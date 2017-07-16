$(document).ready(function(){
  $(".button-collapse").sideNav();
  $('select').material_select();
});

var conversion={
  'rice':30,
  'wheat':10,
  'maize':20,
  'crop':40,
  'amp':100,
  'ams':120,
  'urea':110,
  'pn':90
}

function changedCrop(){
  $("#price").val(conversion[$("#crop-name").val()]*$("#amt").val());
}

function areaChanged(){
  var area=Number($("#area").val());
  
}