Star.Package("app",
  Star.Class("Model",null,{
    data:null,view:null,
    
    construct:function(data,view){
      this.data = JSON.parse(data);
      this.view = view;
      
      this.view.attachView(this.data);
      
      
    }
  })
);