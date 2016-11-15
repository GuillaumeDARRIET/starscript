//Config Star
Star.SetConfig({
  paths:{
    'templates':'web/html',
    'styles':'web/css',
    'src':'web/js',
    'data':'web/json',
    'libs':'libs'
  },
  debug:{
    loaderSuccess:false,
    loaderError:false,
    loaderProgress:false,
    importStack:false
  }
});

//Config Builder
Star.Builder.SetConfig({
  name:'build',//name of output file 
  exludedPaths:['libs'],//exclude specific paths to build
  
  //options by file type, file type is define in Import function, with !
  fileTypes:{
    //your can add your own file type here
    json : {
      added : false,
    },
    css : {
      added : true,//this type is add to build
      //here, you define which functions used
      //check the default config to see all functions
      removeScriptComments : true,
      removeHtmlComments : false,
      removeTabulations : true,
      removeBreakLines : true,
      removeMultiWhiteSpaces : true
    },
    html : {
      added : true,
    }
  },
  //here you can re-write some function or added your own
  regexpFunctions:{
    
  },
  //if you add a regexpFunctions, you need to set this array,
  //and add your function in fileTypes options
  //here, you can set the order functions (id 0 is execute in first)
  regexpExecutionOrder : [
    'removeScriptComments',
    'removeHtmlComments',
    'removeTabulations',
    'removeBreakLines',
    'removeMultiWhiteSpaces'
  ]
});


//with this config, you add in your builder.js all imported files, but not files in 'libs' folder and not json type file

//set true to launch Builder
if(false){
  
  //the builder start with the first Import and read all other Import in the stack
  //callbacks functions are not executed
  Star.Import([
    '[src]/script.js',
    '[libs]/lib.js',
    'html![templates]/template.html',
    'css![styles]/style.css',
    'json![data]/data.json'
  ],function(){
    //not executed in builder mode
  });
  
  
}







/*DEFAULT Star Builder Config
BuilderConfig = {
    name:'build',
    exludedPaths : [],
    fileTypes:{
      script : {
        added : true,
        removeScriptComments : true,
        removeHtmlComments : true,
        removeTabulations : true,
        removeBreakLines : true,
        removeMultiWhiteSpaces : true
      },
      text:{
        added : false,
        removeScriptComments : false,
        removeHtmlComments : false,
        removeTabulations : false,
        removeBreakLines : false,
        removeMultiWhiteSpaces : false
      },
      json : {
        added : false,
        removeScriptComments : false,
        removeHtmlComments : false,
        removeTabulations : true,
        removeBreakLines : true,
        removeMultiWhiteSpaces : true
      },
      css : {
        added : false,
        removeScriptComments : true,
        removeHtmlComments : false,
        removeTabulations : true,
        removeBreakLines : true,
        removeMultiWhiteSpaces : true
      },
      html : {
        added : false,
        removeScriptComments : false,
        removeHtmlComments : true,
        removeTabulations : true,
        removeBreakLines : true,
        removeMultiWhiteSpaces : true
      }
    },
    regexpFunctions:{
      removeScriptComments:function(data){return data.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm,"");},
      removeHtmlComments:function(data){return data.replace(/<!--[\s\S]*?-->/gm,"");},
      removeTabulations:function(data){return data.replace(/\t/gm," ");},
      removeBreakLines:function(data){return data.replace(/(\r\n|\n|\r)/gm," ");},
      removeMultiWhiteSpaces:function(data){return data.replace(/\s{2,}/gm," ");}
    },
    regexpExecutionOrder : ['removeScriptComments','removeHtmlComments','removeTabulations','removeBreakLines','removeMultiWhiteSpaces']
  }
 */