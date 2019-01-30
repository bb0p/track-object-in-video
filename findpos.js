<video id="video">
	<source src="video.mp4" type="video/mp4" />
</video>
<canvas id="canvas"></canvas>
<script>

// the central parameters for the script:
xw = 50; yw = 50; // search window size
xorigin = 425; yorigin = 120; // starting point
x = xorigin; y = yorigin; // moving point
r = 5; // search radius
skip = 1; // skip some points in the search window (0 = none)
time = 2; time_delta = .03; // starting time and increments
moveon = 30; // when to move on to the next "frame"

setTimeout(function() {
	video = document.getElementById("video");
	canvas = document.getElementById("canvas");
	canvas2DContext = canvas.getContext("2d");
	cw = video.clientWidth; ch = video.clientHeight; // copy video dimensions
	canvas.width = cw; canvas.height = ch; // and use for canvas
	// get initial copy of image to hold on to
	canvas2DContext.drawImage(video,0,0);
	old = canvas2DContext.getImageData(x, y, xw, yw);
	pres = canvas2DContext.getImageData(x, y, xw, yw);
	limit = old.data.length;
	setTimeout(FindSubimage,2000);
	function FindSubimage(){
		timestamp = new Date().getTime(); // for dev purposes
		video.currentTime = time;
		canvas2DContext.drawImage(video,0,0);
		// retrive the window to search within
		var img = canvas2DContext.getImageData(x-r, y-r, xw+r*2, yw+r*2);
		var mcc = Number.MAX_VALUE; // mcc holds min search result
		var ix = 0, iy = 0; // indicies to hold result of search
		// search for the minimum value in the r neighborhood
		for (var xd = -r; xd <= r; xd++){ for (var yd = -r; yd <= r; yd++){
        		var cc = 0;
        		for(var i = 0; i < limit; i+=1+skip) {
				var j = (r+yd+Math.floor(i/(xw*4)))*4*(r*2+xw)+(i%(xw*4))+(r+xd)*4;
                		cc += Math.abs(old.data[i] - img.data[j]);
        		}
			if (cc < mcc){
				mcc = cc; // remember min value
				ix = xd; iy = yd;  // and indicies
			}
		}
	}
	x += ix; y += iy; // adjust subimage position
	// make sure that the search frame is within the image
	var newx=Math.min(x, cw-r-1), newy=Math.min(y, ch-r-1);
	    newx=Math.max(x,r+1);    newy=Math.max(y, r+1);
	if (newx==x && newy==y){ // within bounds 
       		for(var i = 0; i < limit; i++) { // transfer min value to old
			var j=(r+iy+Math.floor(i/(xw*4)))*4*(r*2+xw)+(i%(xw*4))+(r+ix)*4;
			old.data[i]=img.data[j];
			pres.data[i]=img.data[j];
		}
		x=newx; y=newy;
	} else { // implicitly remember the old image
		console.log('whoops');
	}
	time = Math.ceil(100*(time+time_delta))/100; // get ready for next "frame"
	for(var i = 0; i < limit; i+=Math.floor((Math.random()*10)+10)) {
		pres.data[i]=Math.floor(Math.random()*255);}; // put some speckles on..
	canvas2DContext.putImageData(pres,x,y); // and draw it in position
	console.log(time,new Date().getTime()-timestamp,mcc,ix,iy,x,y);
	if (time < video.duration) {setTimeout(FindSubimage, moveon)}; // next "frame"
}
},2000);
</script>
