/**
*StarTemplate HOW TO USE
*/

//micro temlating exemple
//<%=myVar%> => replace this code by myVar value
//<% {some code} %> => execute js scripts
//<% print("something"); %> => print function add a string to template like <%={some_string}%>, use only one time between every <% %>
Star.Package("app",
  Star.Class("Main",[null,Star.StarTemplate],{
    
    htmlTemplate:'<h2><%=myTilte%></h2><br />'+
    '<span><%=myDesc%></span><br /><br />'+
    '<% '+
    'var result="";'+
    'for(var i=0;i<3;i++){'+
    ' result += "test "+tab[i]+" "; '+
    '}'+
    'print(result);'+
    '%>',
    
    data:{
      "myTilte":"This is My title",
      "myDesc":"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "tab":["A","B","C"]
    },
    
    construct : function construct (){
      var html = this.template(this.htmlTemplate,this.data);
      document.getElementById("container").innerHTML = html;
    }
  })
);


//start
var main = app.Main();