/**
*StarViews HOW TO USE
*/
// /!\ StarViews use StarRouter, refer to exemple 11
(function(){
  window.LANG = Star.Localization("en-UK",["en-UK","fr-FR"]);//activate localization

  Star.SetConfig({
    paths:{
      'views':'web/views'
    }
  });
  
  Star.Import([
    "[views]/MyView.js"
  ],
  function(){
    app.MyView();
  });
  
})();