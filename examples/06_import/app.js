//you can define shorts paths in Star.SetConfig :
Star.SetConfig({
  paths:{
    'js':'web/js',
    'text':'web/text'
  },
  //you can trace all import or loading
  debug:{
    loaderSuccess:false,
    loaderError:false,
    loaderProgress:false,
    importStack:false
  },
  //default params
  useLocalStorage:false,
  localStorageId:(new Date()).getTime(),//use a static id in production
  storedFileTypes:{
    "script":true,//if localStorage is activate, this file will store
    "css":true,
    "html":true,
    "json":false,//and not this one
    "text":false
    //you define customs files types
  }
});
  //StarScript use localstorage with getTime id, if you want to get loaded file from localstorage you can add a storage ID
  //use Star.LocalStorageUpToDate() to know if your current version match with localStorage files 


//Star.Import take two arguments :
//- an array with files' url
//- a callback function
Star.Import([
"[js]/MyClass.js"
],function(){
  
  var instance = app.MyClass();
  
});

// if you want to control order of loading : you can do
//Fist argument : array of array of urls, second : the callback funtion
/**
Star.Import(
[
  //dependencie1.js and dependencie2.js are loaded simultaneously, in first
  [
    "path/to/dependencie1.js",
    "path/to/dependencie2.js"
  ],
  //lib.js is loaded in second, after dependencie1.js and dependencie2.js are executed
  [
    "path/to/lib.js"
  ],
  //myclass1.js and myclass2.js are loaded in last, after lib.js is executed
  [
    "path/to/myclass1.js",
    "path/to/myclass2.js"
  ]
]
,function(){
  
  //do something
  
});

*/

