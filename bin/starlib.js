/**
* StarLib 1.0.4
* author DARRIET GUILLAUME 
* https://lebonnumero.fr/
*
*/

/**
* INTERFACE EVENT DISPATCHER
*/
Star.Package("Star",
  Star.Interface("StarEventDispatcher",{
    on:function on(eventName,handler,params){
      this.__eventDispatcherInit(eventName);
      this.__eventDispatcherHandlers[eventName].push(handler);
      this.__eventDispatcherParams[eventName].push(params);
      return this;
    },
    off:function off(eventName,handler){
      this.__eventDispatcherInit(eventName);
      if(!eventName){
        this.__eventDispatcherHandlers = {};
        this.__eventDispatcherParams = {};
      }
      else if(!handler ){
        delete this.__eventDispatcherHandlers[eventName];
        delete this.__eventDispatcherParams[eventName];
      }
      else{
        var id = this.__eventDispatcherHandlers[eventName].indexOf(handler);
        if(id !=-1){
          this.__eventDispatcherHandlers[eventName].splice(id, 1);
          this.__eventDispatcherParams[eventName].splice(id, 1);
        }
      }
      return this;
    },
    trigger:function trigger(eventName,evt){
      this.__eventDispatcherInit(eventName);
      if(!evt)
        evt = {};
      evt.eventName = eventName;
      evt.dispatcher = this;
      this.__eventDispatcherInit(eventName);
      var length = this.__eventDispatcherHandlers[eventName].length;
      for(var i=0;i<length;i++){
        this.__eventDispatcherHandlers[eventName][i].apply(null,[evt,this.__eventDispatcherParams[eventName][i]]);
      }
      return this;
    },
    __eventDispatcherInit:function __eventDispatcherInit(eventName){
      if(!eventName)
        return;
      if(!this.__eventDispatcherHandlers){
        this.__eventDispatcherHandlers = {};
        this.__eventDispatcherParams = {};
      }
      if(!this.__eventDispatcherHandlers[eventName]){
        this.__eventDispatcherHandlers[eventName] = [];
        this.__eventDispatcherParams[eventName] = [];
      }
    }
  })
);
/**
* INTERFACE TEMPLATE
*/
Star.Package("Star",
  Star.Interface("StarTemplate",{
    __templateEvalScope : function __templateEvalScope(s,data){
      var arguments = [], values = [];
      for(var key in data){
        values.push(data[key]);
        arguments.push(key);
      }
      arguments.push("__expressionToEvaluate");
      values.push(s);
      var source = "var print = function(msg){return msg;}; ";
      source += "return eval(__expressionToEvaluate);";
      arguments.push(source);
      
      var render = Function.apply(null,arguments);
      return render.apply(null,values);
    },
    template:function template(s,data){
      var regexp = /\<\%([\s\S]*?)\%\>/gm;
      var tab = s.match(regexp);
      if(!tab || tab.length === 0 )
        return s;
      var exp;
      for(var i=0;i<tab.length;i++){
        exp = tab[i];
        if(exp.substr(2,1) === "="){
          exp = exp.substring(3);
          exp = exp.substring(0,exp.length-2).trim();
          var catchExp = exp.split('"').join('\\"');
          exp = ' try {print('+exp+');}catch(e){print(\"<%='+catchExp+'%>\");}';
        }
        else{
          exp = exp.substring(2);
          exp = exp.substring(0,exp.length-2);
        }
        var result = this.__templateEvalScope(exp,data);
        var resType = typeof(result);
        if(resType === "number" || resType === "string")
          result = result+"";
        else
          result = "";
        s = s.split(tab[i]).join(result);
      }
      return s;
    }
  })
);

/**
* CLASS ROUTER
*/
Star.Package("Star",
  Star.Class("StarRouter",[null,Star.StarEventDispatcher],{
    pathname:"",baseURI:"/",uri:'',autorizedLangs:[],alias:{},lang:"",params:[],route:'',routeAlias:'',
    construct:function construct(){
      if(Star.StarRouter.Static.instance !== null)
        throw "ConflictSingleton: Star Router must be unique";
      var base = document.getElementsByTagName("base");
      if(base.length < 1)
        throw "MissingBase: Add a base tag in head of document with relative path in href attribute, like <base href=\"/relative/path/\"> or <base href=\"/\">";
      this.baseURI = base[0].getAttribute("href");
      if(this.baseURI.substr(0,4)==="http")
        throw "BaseHrefError: use relative path in base tag";
      if(this.baseURI.substr(0,1)!="/" || this.baseURI.substr(this.baseURI.length-1,1) != "/")
        throw "BaseHrefError: base href must start and finish by / ";
      
      this.__parsePathname(window.location.pathname,true,true);
      window.addEventListener("popstate", this.__onPopState);
    },
    __onPopState:function __onPopState(evt){
      this.__parsePathname(window.location.pathname,true);
      this.trigger("change");
    },
    __onClickHyperlink:function __onClickHyperlink(evt){
      evt.preventDefault();
      var target = evt.currentTarget;
      var href = target.getAttribute("href");
      if(href)
        this.setURI(href);
    },
    __parsePathname:function __parsePathname(pathname,fullURI,cancelReload){
      this.route = "",this.routeAlias="",this.params=[];
      var uri = pathname;
      if(fullURI)
        uri = pathname.substring(this.baseURI.length);
      var tab = uri.split("/");
      var route="";
      if(this.lang != ''){//localization activate
        if(tab.length >0 && tab[0] != this.lang && this.autorizedLangs.indexOf(tab[0]) !== -1){
          if(!cancelReload){//language change, reload page
            window.location.href = this.baseURI+uri;
            return;
          }else
            this.lang = tab[0];
        }
        if(tab.length > 0 && tab[0] === this.lang)
          tab = tab.slice(1);
      }
      if(tab.length > 0)
        route = tab[0];
      if(tab.length > 1)
        this.params = tab.slice(1);
      if(this.params.length === 1 && this.params[0] === "")
        this.params = [];
      this.routeAlias = route;
      if(this.alias[route])
        this.route = this.alias[route];
      else
        this.route = route;
      this.uri = (this.lang===""?"":this.lang +"/") + route + (this.params.length>0?"/"+this.params.join("/"):"");
      this.pathname = this.baseURI + this.uri;
    },
    catchHyperlink:function catchHyperlink(container){
      if(container){
        var links = container.getElementsByTagName("a");
        var href;
        for(var i=0;i<links.length;i++){
          href = links[i].getAttribute("href");
          if(links[i].className.indexOf("StarHyperlink") === -1 && href && 
          href.substr(0,4) != "http" && href.substr(0,6) != "mailto" &&
          href.substr(0,3) != "tel"){
            links[i].className += " StarHyperlink";
            links[i].addEventListener("click",this.__onClickHyperlink);
          }
        }
      }
    },
    addAlias:function addAlias(alias,target){
      if(typeof(alias) === "string" && typeof(target)=== "string")
        this.alias[alias] = target;
      else if(typeof(alias) === "object"){
        for(var key in alias){
          this.alias[key] = alias[key];
        }
      }
      if(this.alias[this.route])
        this.route = this.alias[this.route];
    },
    setURI:function setURI(uri){
      this.__parsePathname(uri);
      history.pushState(null, null, this.pathname);
      this.trigger("change");
    },
    getURI:function getURI(){
      var uri = (this.lang===""?"":this.lang +"/") + this.route + (this.params.length>0?"/"+this.params.join("/"):"");
      return uri;
    },
    getLang:function getLang(){
      return this.lang;
    },
    getRoute:function getRoute(){
      return this.route;
    },
    getRouteAlias:function getRouteAlias(){
      return this.routeAlias;
    },
    getParams:function getParams(){
      return this.params;
    },
    localization : function localization(defaultLang,autorizedLangs){
      this.autorizedLangs = autorizedLangs;
      this.lang = defaultLang;
      this.__parsePathname(window.location.pathname,true,true);
      history.replaceState(null,null,this.pathname);
      return this.lang;
    }
  },{
    instance:null,
    getInstance:function getInstance(){
      if(Star.StarRouter.Static.instance === null)
        Star.StarRouter.Static.instance =  Star.StarRouter();
      return Star.StarRouter.Static.instance;
    }
  })
);

/**
* CLASS VIEW
*/
Star.Package("Star",
  Star.Class("StarView",[null,Star.StarEventDispatcher,Star.StarTemplate],{
    name:'',domID:"",container:null,
    dataFiles:[],htmlFiles:[],cssFiles:[],data:{},
    cssID:'',renderClearContainer:true,router:null,
    construct:function construct(){
      this.router = Star.StarRouter.Static.getInstance();
      if(this.domID != "")
        this.container = document.getElementById(this.domID);
    },
    render: function render(){
      this.removeListeners();
      this.extractData();
     
      if(this.container && this.renderClearContainer)
        this.container.innerHTML = "";
      this.appendHTML();
      this.appendCSS();
      this.router.catchHyperlink(this.container);
    },
    extractData: function extractData(){
      var data;
      for(var i=0;i<this.dataFiles.length;i++){
        data = JSON.parse(Star.GetFile(this.dataFiles[i]));
        for(var key in data)
          this.data[key] = data[key];
      }
    },
    appendCSS:function appendCSS(){
      var cssContainer;
      if(this.cssID !== ""){
        cssContainer = document.getElementById(this.cssID);
        if(cssContainer && cssContainer.innerHTML !== "")
          return;
      }
      var file,css="";
      for(var i=0;i<this.cssFiles.length;i++){
        file = Star.GetFile(this.cssFiles[i]);
        file = this.template(file,this.data);
        css += file;
      }
      var style = document.createElement("style");
      style.innerHTML = css;
      if(cssContainer)
        cssContainer.appendChild(style);
      else if(this.container)
        this.container.appendChild(style);
    },
    appendHTML:function appendHTML(){
      var file,html="";
      for(var i=0;i<this.htmlFiles.length;i++){
        file = Star.GetFile(this.htmlFiles[i]);
        file = this.template(file,this.data);
        html += file;
      }
      if(this.container){
        this.container.innerHTML += html;
      }
    },
    removeListeners:function removeListeners(){
      this.off();
    },
    destruct:function destruct(){
      this.removeListeners();
      this.remove();
    }
  })
);

/**
* USE LOCALISATION
*/
Star.Localization = function(defaultLang,autorizedLangs){
  var router = Star.StarRouter.Static.getInstance();
  return router.localization(defaultLang,autorizedLangs);
}