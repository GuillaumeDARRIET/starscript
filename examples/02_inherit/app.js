//Parent Class
var MyParent = Star.Class("MyParent",null,{
  name:"",
  
  construct:function construct(name){
    this.name = name;
  },
  
  setName:function setName(name){
    this.name = name;
  },
  
  getName:function getName(){
    return this.name;
  },
  
  log:function log(msg){
    var el = document.getElementById("trace");
    el.innerHTML = msg+"<br />"+el.innerHTML
  }
  
});

//Child Class
var MyChild = Star.Class("MyChild",MyParent,{
  //new function
  logName:function logName(){
    var customName = this.getName();
    this.log(customName);
  },
  
  //override function :
  getName:function getName(){
    return "-"+this.name+"-";
  },
  
  //override function and call parent function
  log:function log(msg){
    msg = "[LOG] "+msg;
    //to call parent function, use  : "[ParentName]_[Method](params...)"
    this.MyParent_log(msg);
  }
  
});

//instantiate child
var child = MyChild("Child");
child.logName();
//use not overrided function :
child.setName("Child2");
child.logName();
