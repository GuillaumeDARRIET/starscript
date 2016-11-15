//if you want to import a non-script file, set type of file in url :  type!path_of_file
Star.Import([
"text![text]/file1.txt",
"text![text]/file2.txt"
],function(){

Star.Package("app",

  Star.Class("MyClass",null,{
    
    construct:function(){
     
      //you can get all loaded file with :
      var file = Star.GetFile("[text]/file1.txt");
      this.log(file);
      
      file = Star.GetFile("[text]/file2.txt");
      this.log(file);
    },
 
    log:function(msg){
      var el = document.getElementById("trace");
      el.innerHTML = msg+"<br />"+el.innerHTML;
    }
  })
)

});