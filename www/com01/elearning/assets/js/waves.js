
// draws a clipPath of type polygon( using percentages ), modifying only one of the rectangle edge. 

function PolyCalc(	f, /* a function(t)  from [0, infinity) => [0, 1]*/
					s, /* a slice function(y, i) from y [0,1] => [0, 1], with slice index, i, in [0, n]*/
					w, /* window size in seconds*/
					n, /* sample size*/
					o, /* orientation => left/right/top/bottom - the 'flat edge' of the polygon*/ 
					a  /* amplitude => [0,100] defines the shape height in percentage relative to element's full height */ 
                  ) 
{
	this.polyStart = "polygon(";
	this.polyTop = this.polyStart + "0% 0%, "; // starts in the top left corner
	this.polyBottom = this.polyStart + "0% 100%, ";//starts in the bottom left corner
	this.polyRight = this.polyStart + "100% 0%, "; //starts in the top right corner
	this.polyLeft = this.polyStart + "0% 0%, "; //starts in the top left corner
  
	var self = this;
	self.mapFunc = s;
	this.func = f;
	this.window = w;
	this.count = n;
	var dt = w/n;  

	switch(o) {
		case "wbottom": this.poly = this.polyTop; break;
		case "wtop": 	this.poly = this.polyBottom; break;
		case "wleft": 	this.poly = this.polyRight; break;
		case "wright": 	default: this.poly = this.polyLeft; break;
	}
    
	a = a || 20; // if not defined, the default amplitude for the shape is 20% of the element height
	this.CalcPolygon = function(t) {
		var p = this.poly;
		let spareheight = 100-a;
		for (i = 0; i < this.count; i++) {
			x = 100 * i/(this.count-1.0);
			y = this.func(t + i*dt); // this.func() returns a [0 to 1] range
			
			if(typeof self.mapFunc !== 'undefined') y=self.mapFunc(y, i);
		
			
			y=spareheight+y*a; // 25% height wave
			// y*=100; // full height wave
			
			switch(o) {
				case "wbottom": p += x + "% " + y + "%, "; break;
				case "wtop": 	p += x + "% " + (100-y) + "%, "; break;
				case "wleft": 	p += (100-y) + "% " + x + "%, "; break;
				case "wright": 	default: p += y + "% " + x + "%, "; break;          
			}
		}
		
		switch(o) { 
			case "wbottom": p += "100% 0%)"; break; // top right corner
			case "wtop": 	p += "100% 100%)"; break;
			case "wleft": 	p += "100% 100%)"; break;
			case "wright": default: p += "0% 100%)"; break;
		}
		
		return p;
	}
};



function MapRange(value, min, max, newMin, newMax) { // damping effect on the left side
	// return value;
	return value * (newMax - newMin)/(max-min) + newMin;
}


function C_waved(element, options) {
	
	this.element = element;
	this.options = options || { animate:false }; // like { animate:false, frequence:1, phase:1, speed:10, amplitude:10 }
	
	var orientation = element.classList[1]; // selects the second class attribute, should be one of [wtop,wbottom,wright,wleft]
	
	var frequence = options.frequence||2;
	var amplitude = options.amplitude||10;

		var vw = window.innerWidth; // browser viewport width in pixel (typical on computer screen is 1200px)
		var ew = element.offsetWidth;
		
	var windowWidth = Math.PI*vw/ew; // the time domain window which determines the range from [t, t+windowWidth] that will be evaluated to create the polygon
	var sampleSize = (frequence*4)*(amplitude/4); // number of points in the polygon, the higher the frequence, the higher the needed number of dots to draw a visually smooth shape
	 
	this.t = options.phase || 0;
	this.speed = options.speed/2400||6/2400;
	
	this.polygon = new PolyCalc(
		function(t) { //The time domain wave function
			return (Math.sin(frequence * t) + 1)/2; // sine is [-1, -1], so we remap to [0,1]
		},
		function(y, i) { //slice function, takes the time domain result and the slice index and returns a new value in [0, 1]  
			// return y;
			return MapRange(y, 0, 1, (sampleSize-i)/sampleSize, 1.0);  //Here we adjust the range of the wave to 'flatten' it out a bit.  We don't use the index in this case, since it is irrelevant
		},
		windowWidth, //1 second, which with an angular frequency of 2pi rads/sec will produce one full period.
		sampleSize, //the number of samples to make, the larger the number, the smoother the curve, but the more points in the final polygon
		orientation, //the location
		amplitude
	);
	  
	
	// initial shape setting
		let shape = this.polygon.CalcPolygon(this.t);
	this.element.style.clipPath = shape;
	this.element.style.shapeOutside = shape;
	
	var that = this;
	this.a = function() { that.animate.apply(that); }
	this.parity = C_waved.static.icount;
	C_waved.static.icount++;


	if(this.options.animate) this.animate(); // uncomment to go to prod ( saves processing on dev stations )
	
}
C_waved.static = { icount:0 }
C_waved.prototype = {
	animate: function() {
		this.parity++; 
		let dorefresh = (this.parity%4)==0;
		if(dorefresh) { // this will divide by 2 the animation processing effort, by skipping one frame recalculation every two.
				var d = new Date();
				var m = d.getMilliseconds();
			// console.log(this.parity, m);
			var shape = this.polygon.CalcPolygon(this.t); 
			this.element.style.clipPath = shape;
		}   
		this.t -= this.speed;
		requestAnimationFrame(this.a); // the frame speed is 60Hz
	}
}
// Animation - animate the wave by uncommenting this section
// Also demonstrates a slice function which uses the index of the slice to alter the output for a dampening effect.







