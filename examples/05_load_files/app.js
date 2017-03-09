//application package
Star.Package("app",
  //Loader class
  Star.Class("Loader",null,{
    
    //on progress event
    onProgress:function onProgress(loaded,total,options){
      //if 'loaded' and 'total' equal 0, it's mean event.lengthComputable = false
      //probably your server gzip your file
      this.log("loading : "+loaded+"/"+total);
    },
    
    //error event
    onError:function onError(event,options){
      this.log("error : "+options.url);
    },
    
    //success
    onSuccess:function onSuccess(file,options){
      this.log("success : "+options.url);
      this.log(file);
    },
    
    
    load:function load(url){
      //test http server available
      var cross_domain = window.location.href.substring(0,4);
      if(cross_domain === "http"){
        
        //all params are set here
        //only url are require
       
        var options = {
          url:url,
          type:'text',
          success:this.onSuccess,
          error:this.onError,
          progress:this.onProgress,
          nocache:false
        }
        
         //default setting :
        /*
         var options = {
          url:'',
          type:'text',
          success:null,
          error:null,
          progress:null,
          nocache:false
        }
        */
        
        //Star.Load return a xmlHttpRequest object
        var xhr =  Star.Load(options);
        
      }
      else{
        document.getElementById("warning").style.display = "inline";
      }

    },
    
    log:function log(msg){
      var el = document.getElementById("trace");
      el.innerHTML = msg+"<br />"+el.innerHTML;
    }
    
  })
);

var loader = app.Loader();

loader.load("test.txt");