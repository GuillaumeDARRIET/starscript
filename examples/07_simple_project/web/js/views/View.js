//a basic class view, attach template to a div
Star.Package("app",
  Star.Class("View",null,{
    html:"",
    css:"",
    htmlElement:null,
    containerId:'',
    
    attachView:function(data){
      //set <%variables%> to text
      this.replaceData(data);
      //attach template to html element
      this.htmlElement = document.getElementById(this.containerId);
      this.htmlElement.innerHTML = this.html;
      
      //create style element and attach css
      var style = document.createElement("style");
      style.innerHTML = this.css;
      this.htmlElement.appendChild(style);
    },
    
    replaceData:function(data){
      
      for(var key in data){
        this.html = this.html.replace("<%="+key+"%>",data[key]);
      }
    }
    
  })
);