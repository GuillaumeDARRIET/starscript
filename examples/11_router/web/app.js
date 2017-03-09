/**
*StarRouter HOW TO USE
*/
// StarRouter use history API
// /!\ you need to set base tag in html head to use StarRouter!!
// /!\ you need .htaccess to use StarRouter!! don't forget to edit it

//StarRouter is a singleton, you can access it by : Star.StarRouter.Static.getInstance();

Star.Package("app",
  Star.Class("Main",null,{
    router:null,
    construct : function construct(){
      this.router = Star.StarRouter.Static.getInstance();
      this.router.on("change",this.routeChange);//if route change
      
      //set links
      document.getElementById("link1").addEventListener("click",this.onLink);
      document.getElementById("link2").addEventListener("click",this.onLink);
      document.getElementById("link3").addEventListener("click",this.onLink);
      
      //catch Hyperlink on Dom Element, only relative path in href, absolute urls like https://lebonnumero.fr are not catch
      this.router.catchHyperlink(document.body);//call if Dom Element change
      
      this.log(this.router.getURI());//get URI
    },
    routeChange:function routeChange(){
      this.log('lang:'+this.router.getLang()+
      ', route:'+this.router.getRoute()+
      ', alias:'+this.router.getRouteAlias()+
      ', params:'+this.router.getParams().join('/'));
    },
    onLink:function onLink(evt){
      var target = evt.currentTarget
      var data = target.getAttribute("data");
      this.router.setURI(data);//Set URI => with or without language
    },
    log:function log(msg){
      var el = document.getElementById("trace");
      el.innerHTML = msg+"<br />"+el.innerHTML
    }
  })
);

//optionnal : StarRouter manage language, 
var currentLang = Star.Localization("en-UK",["en-UK","fr-FR"]);//first is default language, second is list of autorized languages
//optionnal : alias
Star.StarRouter.Static.getInstance().addAlias({
  "my-page-one":"page1",
  "my-page-two":"page2"
});
// or
Star.StarRouter.Static.getInstance().addAlias("my-page-three","page3");


//Start
var main = app.Main();