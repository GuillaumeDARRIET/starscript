
Star.Import([
"[views]/View.js",
"html![templates]/main.html",
"css![css]/main.css",
],function(){

Star.Package("app",

  //My View extend View
  Star.Class("MyView",app.View,{
    containerId:'main',
    
    construct:function(){
      this.html = Star.GetFile('[templates]/main.html');
      this.css = Star.GetFile('[css]/main.css');
    }
    
  })
);

});