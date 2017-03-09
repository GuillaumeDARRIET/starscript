Star.Package("app",
  //first argument is interface Name,
  //second interface in an object
  Star.Interface("Printer",{
    //note, interface haven't attribute, only methods
    //interface haven't Static
    
    print:function print(msg){
      var el = document.getElementById('trace');
      el.innerHTML = msg+"<br/>"+el.innerHTML;
    }
    
  })
);

Star.Package("app",
  //second argument is a class OR an array => at first index : parent class, then interfaces 1, 2, 3...
  Star.Class("MyClass",[null,app.Printer],{
    
    construct : function construct(){
      this.print("My Class Instanciate");
    }
  })
);

Star.Package("app",
  //MyExtend implement Printer automatically
  Star.Class("MyExtend",app.MyClass,{
    
    construct : function construct(){
      this.print("My Extend Instanciate");
    }
    
  })
);


app.MyClass();
app.MyExtend();