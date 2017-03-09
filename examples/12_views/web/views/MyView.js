Star.Import([
  "json![views]/data.json",
  "css![views]/style.css",
  "html![views]/template.html"
],function(){
  
  Star.Package("app",
    //StarView implement StarEventDispatcher and StarTemplate
    Star.Class("MyView",Star.StarView,{
      name : 'MyView',//usefull for some features, like shared css
      domID : 'myViewContainer',// id of dom element (container of the view)
      cssID:'',//empty by default, id of dom element (container of shared css)
      renderClearContainer:true,//true by default, if true, container is emptied before append template
      dataFiles:['[views]/data.json'],//json files with data
      htmlFiles:['[views]/template.html'],//html files for template
      cssFiles:['[views]/style.css'],//css files for style
      
      construct : function construct(){
        this.StarView_construct();// /!\ don't forget ! it is an override !
        
        //StarView keep instance of StarRouter
        this.router.on("change",this.routerChange);
        
        //remove listenners attached
        //Extract data of json files
        //add html and css
        //catch hyperlinks in this.container 
        this.render();
      },
      routerChange:function routerChange(){
        //console.log(this.router.getURI());
      }
    })
    
  );
  
});