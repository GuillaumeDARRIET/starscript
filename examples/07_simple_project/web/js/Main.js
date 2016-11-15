

Star.Import([
"[views]/MyView.js",
"[models]/MyModel.js"
],function(){

Star.Package("app",

  //main class
  Star.Class("Main",null,{
    
    view:null,model:null,
    
    construct:function(){
      this.view = app.MyView();
      this.model = app.MyModel(this.view);
    }
    
    
  })
  
  
);

});