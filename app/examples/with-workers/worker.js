var genRandStr = function(iterations){
       var str = '';
       for(var i = 0; i < iterations; i++){
         //5 chars per iteration
         str += Math.random().toString(36).substring(7);
       }
      return str;
    };

self.addEventListener('message', function(e){
  self.postMessage(genRandStr(e.data));
}, false);