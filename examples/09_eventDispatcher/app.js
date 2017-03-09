/**
*StarEventDispatcher HOW TO USE
*/

// when myButton was push, this class dispatch an event
Star.Package("app",
  Star.Class("Dispatcher",[null,Star.StarEventDispatcher],{
    construct : function construct (){
      var button = document.getElementById("myButton");
      button.addEventListener("click",this.onClick);
    },
    onClick:function onClick(){
      this.trigger("click");
      //this.trigger("click",{name:"click",param1:"myParam"});//you can add custom params
    }
  })
);

//Main Class
Star.Package("app",
  Star.Class("Main",null,{
    dispatcher:null,clickCmp:0,
    construct : function construct (){
      this.dispatcher = app.Dispatcher();
      this.dispatcher.on("click",this.onClick);//Main listen the dispatcher and not directly js event
    },
    onClick:function onClick(){
      this.log("Click");
      this.clickCmp++;
      if(this.clickCmp >= 3)
        this.dispatcher.off("click",this.onClick);//Kill listenning, params are optionnals
    },
    log:function log(msg){
      var el = document.getElementById("trace");
      el.innerHTML = msg+"<br />"+el.innerHTML;
    }
  })
);

//start
var main = app.Main();