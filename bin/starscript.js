/**
* StarScript 1.0.0
* author DARRIET GUILLAUME 
* https://lebonnumero.fr/
*
*/

/**
* Main Scope
*/
var Star = {};
(function(){
  //config
  StarConfig = {
    paths:{},
    debug:{
      loaderSuccess:false,
      loaderError:false,
      loaderProgress:false,
      importStack:false
    }
  };
  /**
  * Public Function
  * Set Config
  */
  Star.SetConfig = function(source,target){
    if(!target)
      target = StarConfig;
    var attr,type;
    for(var key in source){
      type = typeof(source[key]);
      if(type === "object" && !Array.isArray(source[key])){
        if(!target[key])
          target[key] = {};
        Star.SetConfig(source[key],target[key]);
      }
      else
        target[key] = source[key];
    }
  }
  /*******************
  *CLASS MAKER SECTION
  *********************/
  
  /**
  * Private Function
  * Duplicate a class pattern
  *
  * original : source object 
  * return an object
  */
  function cloneObject(original){
    if(original === null)
      return null;
    if(original === undefined)
      return undefined;
    var clone = Array.isArray(original) ?[]:{};
    var type = "";
    var prop;
    for(var key in original){
      prop = original[key];
      type = typeof(prop);
      if(type === "object")
        clone[key] = cloneObject(prop);
      else if(type === "function")
        clone[key] = eval("("+prop.toString()+")");
      else
        clone[key] = prop;
    }
    return clone;
  };
  /**
  * Public Function
  * Create a StarScript Class
  *
  * ClassName : New class name (string)
  * ParentClass : inherited class (object or string, can be null)
  * pattern  : class pattern (object)
  * Static :  static methods and attibutes of class (object, optional)
  * return a function
  */
  Star.Class = function Class (ClassName,ParentClass,pattern,Static){
    if(typeof(ParentClass) === 'string')
      ParentClass = eval(ParentClass);
    
    if(!ParentClass && ClassName!="StarObject")
      ParentClass = Star.StarObject;
    
    var ParentName = ParentClass?ParentClass.Static.__name__:"";
    //extends
    if(ParentClass){
      var ParentStatic = ParentClass.Static;
      var parent = cloneObject(ParentStatic.__pattern__);
      
      for(var i in parent){
        if(typeof(parent[i]) === 'function'){
          var f = parent[i];
          if(!pattern[i])
            pattern[i] = f;
          if(!ParentStatic.__parentName__ || i.indexOf(ParentStatic.__parentName__) === -1)
            pattern[ParentName+"_"+i] = f;
        }
        else if(!pattern[i]){
          pattern[i] = parent[i];
        }
      }
    }
    //new class function
    var NewClass = function(){
      var clone =  cloneObject(NewClass.Static.__pattern__);
      //auto binding instance
      for(var key in clone){
        if(typeof(clone[key]) === 'function'){
          var func = clone[key];
          clone[key] = (function(instance,fct,fct_name){
            return function(){
              if(instance[fct_name])
                return fct.apply(instance,arguments);
            };
          })(clone,func,key);
        }
      }
      if(clone.construct){
        clone.construct.apply(clone,arguments);
      }
      return clone;
    }
    //static
    if(!Static)
      Static = {};
    Static.__name__ = ClassName;
    Static.__parentName__ = ParentName;
    Static.__pattern__ = pattern;
    Static.getClassName = function(){
      return Static.__name__;
    };
    Static.getParentClassName = function(){
      return Static.__parentName__;
    };
    
    NewClass.Static = Static;
    
    return NewClass;
  };
  /**
  * Public Class
  * Base class
  */
  Star.StarObject = Star.Class("StarObject",null,{
    construct:function(){},
    remove:function(){
      for(var index in this) {
        if(index !="remove")
          delete this[index];
      }
      delete this.remove;
    }
  });
  
  
  /*******************
  * PACKAGE SECTION
  *********************/
  
  /**
  * Public Function
  * Attach class to a package
  *
  * NameSpace : package Name (string)
  * Class : a StarScript class
  */
  Star.Package = function Package(NameSpace,Class){
    var Package = window;
    if(NameSpace !== ""){
      var packageArray = NameSpace.split(".");
      Package=window;
      for(var i=0;i<packageArray.length;i++){
        if(!Package[packageArray[i]])
          Package[packageArray[i]] = {};
        Package = Package[packageArray[i]];
      }
    }
    Package[Class.Static.__name__] = Class;
  }
  
  /*******************
  * LOAD FILE SECTION
  *********************/
  //All files loaded
  StarCache = {};
  
  /**
  * Add a new item in StarCache, with default params
  */
  function addCache(url){
    StarCache[url] = {
      file:"",
      event:null,
      state:"loading",
      listeners:[],
      type:"",
      stack : false,
      isEval:false
    }
  }
  /**
  * Public Function
  * Add preloading cache by StarBuilder
  */
  Star.AddCachePreload = function (build){
    for(var url in build){
      addCache(url);
      StarCache[url].file = build[url].file;
      StarCache[url].type = build[url].type;
      StarCache[url].state = "loaded";
    }
  }
  /**
  * Public Function
  */
  Star.GetCacheCopy = function(){
    return JSON.parse(JSON.stringify(StarCache));
  }
  /**
  * Public Function
  */
  Star.GetPathsCopy = function(){
    return JSON.parse(JSON.stringify(StarConfig.paths));
  }
  /**
  * Public Function
  */
  Star.CleanPath = function (url){
    for(var pathName in StarConfig.paths){
      url = url.replace('['+pathName+']',StarConfig.paths[pathName]);
    }
    url = url.replace('//','/');
    return url;
  }
  /**
  * Private Function
  * Handle load file success
  */
  function onXHRSuccess(evt){
    var xhr = evt.currentTarget;
    if(xhr.status !== 200){
      onXHRError(evt);
      return;
    }
    var url = xhr.url;
    var cache = StarCache[url];
    cache.file = xhr.responseText;
    cache.event = evt;
    cache.state = "loaded";
    if(cache.type === "script"){
      cache.isEval = true;
      cache.stack = eval.apply( window, [cache.file]);
    }
    //success callbacks
    for(var i =0;i<cache.listeners.length;i++){
      debug("loaderSuccess",url);
      if(cache.listeners[i].success)
        cache.listeners[i].success(xhr.responseText,cache.listeners[i]);
    }
  }
  /**
  * Private Function
  * Handle load file error
  */
  function onXHRError(evt){
    var url = evt.currentTarget.url;
    var cache = StarCache[url];
    cache.event = evt;
    cache.state = "error";
    
    //error callbacks
    for(var i =0;i<cache.listeners.length;i++){
      debug("loaderError",url);
      if(cache.listeners[i].error)
        cache.listeners[i].error(evt,cache.listeners[i]);
    }
  }
  /**
  * Private Function
  * Handle load file progress
  */
  function onXHRProgress(evt){
    var xhr = evt.currentTarget;
    if(xhr.status !== 200)
      return;
    var loaded = total = 0;
    if(evt.lengthComputable){
      loaded = evt.loaded;
      total = evt.total
    }
    var url = evt.currentTarget.url;
    var cache = StarCache[url];
    
    //progress callbacks
    for(var i =0;i<cache.listeners.length;i++){
      debug("loaderProgress",url);
      if(cache.listeners[i].progress)
        cache.listeners[i].progress(loaded,total,cache.listeners[i]);
    }
  }
  /**
  * Public Function
  * Load a file
  *
  * options : parameters of request (object)
  * => availables :  url (mandatory), success, progress, error, nocache, type(script, text or custom type)
  * return XMLHttpRequest object
  */
  Star.Load = function Load(options){
    if(!options.url){
      console.log("url are missing");
      throw "StarLoadError";
      return;
    }
    
    if(!options.type)
      options.type = "text";
    
    //short url
    options.url = Star.CleanPath(options.url);
    
    //loading file are already ask
    if(StarCache[options.url] && (!options.nocache || StarCache[options.url].state!=="loaded") ){
      var cache = StarCache[options.url];
      if(cache.state === "loading")
        cache.listeners.push(options);//one loading are usefull
      if(cache.state === "loaded"){
        //files already loaded
        if(cache.type === "script" && !cache.isEval){
          cache.isEval = true;
          cache.stack =  eval.apply( window, [cache.file]);
        }
        options.success(cache.file,options);
      }
      if(cache.state === "error" && options.error)
        options.error(cache.event,options);//last loading fail
      return;
    }
    
    //first loading
    addCache(options.url);
    StarCache[options.url].listeners.push(options);
    StarCache[options.url].type = options.type;
    
    var xhr = new XMLHttpRequest();
    xhr.url = options.url;
    
    xhr.addEventListener("load", onXHRSuccess, false);
    xhr.addEventListener("error", onXHRError, false);
    xhr.addEventListener("progress", onXHRProgress, false);
    
    xhr.open("POST", options.url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(null);
    return xhr;
  }
  /**
  * Public Function
  * Get a loaded file
  *
  * url : Url of file, short url available
  */
  Star.GetFile = function(url){
    url = Star.CleanPath(url);
    if(StarCache[url])
      return StarCache[url].file;
    return '';
  }
  /**
  * Public Function
  * Set a loaded file
  *
  * url : Url of file, short url available
  * file : new value of file
  */
  Star.SetFile = function(url,file){
    url = Star.CleanPath(url);
    if(StarCache[url])
      StarCache[url].file = file;
  }
  /**
  * Private Function
  * on Import success
  *
  * file : file content (string)
  * options : options of Star.Load function
  */
  function onImportSuccess (file,options){
    var stack = options.stack;
    //When a file loaded
    function onStackComplete(){
      stack.cmp++;
      //if all dependencies loaded
      if(stack.cmp === stack.total){
        stack.complete = true;
        debug("importStack",stack.label);
        stack.callback();
        for(var i=0;i<stack.listeners.length;i++){
          stack.listeners[i]();
        }
      }
    }
    //The loaded file is in cache
    var cache = StarCache[options.url];
    var deep = cache.stack;
    //if file have dependencies
    if(deep && deep.listeners && deep.complete === false){
      deep.listeners.push(onStackComplete);
    }
    else
      onStackComplete();
  }
  /**
  * Public Function
  * Load multi files
  *
  * orders : files to load (array)
  * callback : when all files are load and there dependencies (function)
  * return a object contain information about callback and files
  */
  Star.Import = function Import(orders,callback){
    var stack = {
      total:orders.length,
      cmp:0,
      callback:callback,
      listeners:[],
      complete:false
    };
    if(StarConfig.debug.importStack){
      stack.label = callback.toString();
      stack.label = stack.label.replace(/(\r\n|\n|\r)/gm," ");
      stack.label = stack.label.replace(/\t/gm," ");
      stack.label = stack.label.replace(/\s{2,}/gm," ");
      stack.label = stack.label.substring(13,70)+"...";
    }
    if(stack.total === 0){
      stack.complete = true;
      debug("importStack",stack.label);
      callback();
    }
    else{
      var url,tab,type;
      for(var i=0;i<stack.total;i++){
        url = orders[i];
        type = "script";
        if(url.indexOf('!') !== -1){
          tab = url.split("!");
          url = tab[1];
          type = tab[0];
        }
        Star.Load({
          url:url,
          type:type,
          success:onImportSuccess,
          stack:stack
        });
      }
    }
    
    return stack;
  }
  
  /**debug**/
  
  function debug(type,msg){
    if(StarConfig.debug[type])
      console.log("["+type+"] "+msg);
  }
})();