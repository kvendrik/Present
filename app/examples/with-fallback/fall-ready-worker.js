var FallReadyWorker = function(options){

	//check if workers are supported
	var usingWorkers = this.usingWorkers = typeof Worker === 'function';

	//if workers are supported
	if(usingWorkers){

		var workerOptions = options.worker;

		//construct blob
		var blobString = "var func = "+String(workerOptions.func)+
			";(function(){"+
				"var onMessage = function(e){ self.postMessage("+String(workerOptions.getPostData)+"(e)); };"+
				"self.addEventListener('message',"+String(function(e){
					e.data = JSON.parse(e.data).data;
					onMessage(e);
				})+", false);"+
				"self.addEventListener('error', "+String(workerOptions.onError || function(e){
					console.log('Line '+e.lineno+' in '+e.filename+': '+e.message);
				})+", false);"+
			"}());",

			//create blob from string
			blob = new Blob([blobString]),

			//create URL object from blob
			blobURL = window.URL.createObjectURL(blob);

		//new worker using blobURL
		var worker = new Worker(blobURL);

		//set client listener
		worker.addEventListener('message', options.onMessage, false);

		//save worker in class
		this.worker = worker;

	}

	this.options = options;
};

FallReadyWorker.prototype.say = function(data){
	var worker = this.worker,
		options = this.options;
		usingWorkers = this.usingWorkers;

	if(usingWorkers){
		//trigger message event on worker
		worker.postMessage(JSON.stringify(data));
	} else {
		//trigger function directly
		options.onMessage({ data: options.worker.getPostData({data:data}) });
	}
};