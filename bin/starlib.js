/**
* StarLib 1.0.5
* author DARRIET GUILLAUME
* https://lebonnumero.fr/
*
*/
//template method :
/*jshint evil:true */
/**
* INTERFACE EVENT DISPATCHER
*/
/*global Star*/
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
        if(id !==-1){
          this.__eventDispatcherHandlers[eventName].splice(id, 1);
          this.__eventDispatcherParams[eventName].splice(id, 1);
        }
      }
      return this;
    },
    trigger:function trigger(eventName,evt){
      this.__eventDispatcherInit(eventName);
      if(!evt){
        evt = {};
      }
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
      if(!eventName){
        return;
      }
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
* FROM UNDERSCORE JS TEMPLATE WITH MODIFICATIONS
*/
Star.Package("Star",
  Star.Interface("StarTemplate",{
    template : function template(text,_data,customSetting) {
      var settings = {
          evaluate    : /<%([\s\S]+?)%>/g,
          interpolate : /<%=([\s\S]+?)%>/g,
          escape      : /<%-([\s\S]+?)%>/g
      };
      if(customSetting){
        settings.evaluate = customSetting.evaluate || settings.evaluate;
        settings.interpolate = customSetting.interpolate || settings.interpolate;
        settings.escape = customSetting.escape || settings.escape;
      }
      // Combine delimiters into one regular expression via alternation.
      var matcher = RegExp([
        settings.escape.source,
        settings.interpolate.source,
        settings.evaluate.source
      ].join('|') + '|$', 'g');

      // Compile the template source, escaping string literals appropriately.
      var index = 0;
      var source = "__p+='";
      var escapes = {
        "'":      "'",
        '\\':     '\\',
        '\r':     'r',
        '\n':     'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
      };
      var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
      var escapeChar = function(match) {
        return '\\' + escapes[match];
      };
      text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset).replace(escaper, escapeChar);
        index = offset + match.length;
        if (interpolate || escape ) {
          var s = interpolate || escape;
          source += "';\n";
          source += "try{__t="+s+"+'';}catch(e){__t='##"+s+"##';}\n";
          if(escape){
            source += "__p+=noHtml(__t); \n";
          }else{
            source += "__p+=__t; \n";
          }
          source +="__p+='";
          //source += "'+\n( __t = (typeof "+interpolate+" !== 'undefined' ? "+interpolate+" : '<%="+interpolate+"%>' )  )+\n'";
          //source += "'+\n( typeof "+interpolate+" !== 'undefined' ? "+interpolate+" : '<%="+interpolate+"%>'   )+\n'";
          //source += "'+\n( __t = (function(){var temp;try{temp="+interpolate+";}catch(e){temp='<%="+interpolate+"%>';}return temp;})()  )+\n'";
        } else if (evaluate) {
          source += "';\n" + evaluate + "\n__p+='";
        }
        return match;
      });
      source += "';\n";
      source = 'with(obj||{}){\n' + source + '}\n';
      source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'');};\n" +
        "noHtml=function(s){return s.replace(/<\\/?[^>]+(>|$)/g, ''); };\n" +
        source + 'return __p;\n';
      try {
        var render = new Function('obj', source);
      } catch (e) {
        e.source = source;
        throw e;
      }
      var template = function(data) {
        return render.call(this, data);
      };
      template.source = 'function(obj){\n' + source + '}';
      return template(_data);
    }
  })
);
/**
* CLASS ROUTER
*/
Star.Package("Star",
  Star.Class("StarRouter",[null,Star.StarEventDispatcher],{
    pathname:"",baseURI:"/",uri:'',autorizedLangs:[],alias:{},lang:"",params:[],route:'',routeAlias:'',paramsAlias:[],
    construct:function construct(parse){
      parse = parse !== false ? true : false;
      if(Star.StarRouter.Static.instance !== null){
        throw "ConflictSingleton: Star Router must be unique";
      }
      var base = document.getElementsByTagName("base");
      if(base.length < 1){
        throw "MissingBase: Add a base tag in head of document with relative path in href attribute, like <base href=\"/relative/path/\"> or <base href=\"/\">";
      }
      this.baseURI = base[0].getAttribute("href");
      if(this.baseURI.substr(0,4)==="http"){
        throw "BaseHrefError: use relative path in base tag";
      }
      if(this.baseURI.substr(0,1)!== "/" || this.baseURI.substr(this.baseURI.length-1,1) !== "/"){
        throw "BaseHrefError: base href must start and finish by / ";
      }
      if(parse){
        this.__parsePathname(window.location.pathname,true,true);
      }
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
      if(href){
        this.setURI(href);
      }
    },
    __parsePathname:function __parsePathname(pathname,fullURI,cancelReload){
      this.route = "";
      this.params=[];
      var uri = pathname;
      if(fullURI){
        uri = pathname.substring(this.baseURI.length);
      }
      this.uri = uri;
      var tab = uri.split("/");
      if(this.lang !== ''){//localization activate
        if(tab.length >0 && tab[0] !== this.lang && this.autorizedLangs.indexOf(tab[0]) !== -1){
          if(!cancelReload){//language change, reload page
            window.location.href = this.baseURI+uri;
            return;
          }else{
            this.lang = tab[0];
          }
        }
        if(tab.length > 0 && tab[0] === this.lang){
          tab = tab.slice(1);
        }
      }
      this.route = "";
      if(tab.length > 0){
        this.route = tab[0];
      }if(tab.length > 1){
        this.params = tab.slice(1);
      }if(this.params.length === 1 && this.params[0] === ""){
        this.params = [];
      }
      this._detectAlias();
      this.uri = (this.lang===""?"":this.lang +"/") + this.routeAlias + (this.paramsAlias.length>0?"/"+this.paramsAlias.join("/"):"");
      this.pathname = this.baseURI + this.uri;
    },
    _detectAlias:function _detectAlias(){
      //gestion des alias
      var currentURI = this.params.length > 0 ? this.route+"/"+this.params.join("/") : this.route;

      var routeParams = "";
      this.routeAlias = this.route;
      this.paramsAlias = this.params;
      for(var routeAlias in this.alias){
        routeParams = currentURI.substr(routeAlias.length);//le reste de la route
        if(routeAlias+routeParams === currentURI && (routeParams==="" || routeParams.substr(0,1)==="/") ){
          var tab = (this.alias[routeAlias]+routeParams).split("/");
          this.route = "";
          this.params = [];
          if(tab.length > 0){
            this.route = tab[0];
          }if(tab.length > 1){
            this.params = tab.slice(1);
          }if(this.params.length === 1 && this.params[0] === ""){
            this.params = [];
          }
          this.routeAlias = routeAlias;
          this.paramsAlias = routeParams.substr(1).split("/");
          break;
        }
      }
    },
    addAlias:function addAlias(alias,target){
      if(typeof(alias) === "string" && typeof(target)=== "string"){
        this.alias[alias] = target;
      }
      else if(typeof(alias) === "object"){
        for(var key in alias){
          this.alias[key] = alias[key];
        }
      }
      this._detectAlias();
    },
    catchHyperlink:function catchHyperlink(container){
      if(container){
        var links = container.getElementsByTagName("a");
        var href;
        for(var i=0;i<links.length;i++){
          href = links[i].getAttribute("href");
          if(links[i].className.indexOf("StarHyperlink") === -1 && href &&
          href.substr(0,4) !== "http" && href.substr(0,6) !== "mailto" &&
          href.substr(0,3) !== "tel"){
            links[i].className += " StarHyperlink";
            links[i].addEventListener("click",this.__onClickHyperlink);
          }
        }
      }
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
    getInstance:function getInstance(parse){
      if(Star.StarRouter.Static.instance === null){
        parse = parse !== false ? true : false;
        Star.StarRouter.Static.instance =  Star.StarRouter(parse);
      }
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
      if(this.domID !== ""){
        this.container = document.getElementById(this.domID);
      }
    },
    render: function render(){
      this.removeListeners();
      this.extractData();

      if(this.container && this.renderClearContainer){
        this.container.innerHTML = "";
      }
      this.appendHTML();
      this.appendCSS();
      this.router.catchHyperlink(this.container);
    },
    extractData: function extractData(){
      var data;
      for(var i=0;i<this.dataFiles.length;i++){
        data = JSON.parse(Star.GetFile(this.dataFiles[i]));
        for(var key in data){
          this.data[key] = data[key];
        }
      }
    },
    appendCSS:function appendCSS(){
      var cssContainer;
      if(this.cssID !== ""){
        cssContainer = document.getElementById(this.cssID);
        if(cssContainer && cssContainer.innerHTML !== ""){
          return;
        }
      }
      var file,css="";
      for(var i=0;i<this.cssFiles.length;i++){
        file = Star.GetFile(this.cssFiles[i]);
        file = this.template(file,this.data);
        css += file;
      }
      var style = document.createElement("style");
      style.innerHTML = css;
      if(cssContainer){
        cssContainer.appendChild(style);
      }else if(this.container){
        this.container.appendChild(style);
      }
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
  var router = Star.StarRouter.Static.getInstance(false);
  return router.localization(defaultLang,autorizedLangs);
};
