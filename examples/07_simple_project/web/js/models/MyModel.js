Star.Import([
"[models]/Model.js",
"json![data]/data.json"
],function(){

Star.Package("app",
  Star.Class("MyModel",app.Model,{
    
    construct:function(view){
      this.Model_construct(Star.GetFile("[data]/data.json"),view);
    }
    
  })
);

});