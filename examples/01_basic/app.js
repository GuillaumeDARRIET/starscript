// Star.class : 3 params => class name, inherited class and class pattern
// return a Class
var MyClass = Star.Class("MyClass",null,{
  //class pattern is an object : don't forget ','
  attr1:0,
  attr2:"",
  
  //constructor
  construct : function(_attr2){
    this.attr1 ++; //'this' is the instance of class
    this.attr2 = _attr2;
  },
  
  //just a basic method to display text
  print : function(){
    document.getElementById("trace").innerHTML = this.attr2;
  }
  
});

//now we can instantiate MyClass, new is useless
var instance = MyClass("my instance");

//and print attr2
instance.print();

//delete instance
instance.remove();

//now instance in a empty objet
console.log(instance);