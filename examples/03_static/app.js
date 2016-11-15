//Create Class, and add static attributes
var MyClass = Star.Class("MyClass",null,{
  id : 0,
  construct:function(){
    this.id = MyClass.Static.getId();
  },
  logID:function(){
    var el = document.getElementById('trace');
    el.innerHTML = this.id+"<br/>"+el.innerHTML;
  }
},
//the fourth attribute is a object with static attributes and methods
{
  idCmp:0,
  getId:function(){
    //avoid use 'this' in Static Method
    MyClass.Static.idCmp++;
    return MyClass.Static.idCmp;
  }
});

var ob1 = MyClass();
var ob2 = MyClass();
var ob3 = MyClass();

ob1.logID();
ob2.logID();
ob3.logID();

//to call static method or attribute, use : [Class].Static.[Method or Attribute]
// ! Warning ! Static methode or attributes are NOT inherit

//there are two basic static method : 
console.log(MyClass.Static.getClassName());
//and, here result is "StarObject", the default class
console.log(MyClass.Static.getParentClassName());