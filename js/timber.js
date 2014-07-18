function timber(){
	//create the canvas
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = 640;
	canvas.height = 480;
	var id = "timber";
	var selectX = 0;
	var selectY = 0;
	var slider1 = new Slider(80, 0.25);
	var slider2 = new Slider(160,0.25);
	// texture(s)
	var dir = "img/timber-assets/";
	var sliderButton = new Image();
	var sliderBar1 = new Image();
	var sliderBar2 = new Image();
	var sliderBar3 = new Image();
	var sliderBar4 = new Image();
	//icons
	var icon1 = new Image();
	var icon2 = new Image();
	var icon3 = new Image();
	var icon4 = new Image();
	//background
	var background = new Image();
	sliderButton.src = dir+"slider-button.png";
	sliderBar1.src = dir+"slider-bar1.png";
	sliderBar2.src = dir+"slider-bar2.png";
	sliderBar3.src = dir+"slider-bar3.png";
	sliderBar4.src = dir+"slider-bar4.png";
	icon1.src = dir+"darker.png";
	icon2.src = dir+"lighter.png";
	icon3.src = dir+"warmer.png";
	icon4.src = dir+"cooler.png";
	background.src = dir+"background.jpg";

	//desktop events
	canvas.addEventListener("mousedown", function (e) {e.preventDefault();checkXY(e,false);down();return false;},false);
	canvas.addEventListener("mousemove", function (e) {e.preventDefault();checkXY(e,false);move();return false;},false);
	canvas.addEventListener("mouseup", function (e) {e.preventDefault();checkXY(e,false);up();return false;},false);
	//mobile events
	canvas.addEventListener("touchstart", function (e) {e.preventDefault();checkXY(e,true);down();return false;},false);
	canvas.addEventListener("touchmove", function (e) {e.preventDefault();checkXY(e,true);move();return false;},false);
	
	function checkXY(event,mobile){
		//set x and y click
		selectX = 0;
		selectY = 0;
		if (mobile) {
			selectX = event.touches[0].pageX;
			selectY = event.touches[0].pageY;
			selectX -= canvas.offsetLeft;
			//USE THIS IF USING skrollr.js
			if (typeof s === 'undefined') {	selectY -= canvas.offsetTop; }
			else selectY -= canvas.offsetTop - s.getScrollTop();
			//ELSE, USE THIS IF NOT USING skrollr.js
			//selectY -= canvas.offsetTop;
		}
		else{
			if (event.x != undefined && event.y != undefined){
				selectX = event.x;
				selectY = event.y + window.pageYOffset;
			}
			else{ //fix mozilla issue
				selectX = event.clientX + document.body.scrollLeft +
					document.documentElement.scrollLeft;
				selectY = event.clientY + document.body.scrollTop +
					document.documentElement.scrollTop;
			}
			selectX -= canvas.offsetLeft;
			selectY -= canvas.offsetTop;
		}
	}
	
	function down(){ slider1.select(); slider2.select(); }
	function move(){ slider1.move(); slider2.move(); }
	function up(){ slider1.release(); slider2.release(); }
	
	function Slider(y, m){
		//declare & init variables
		this.y=y;
		this.m=m;
		this.value=0.5; //50%
		this.width=16;
		this.height=32;
		this.padding=12; //easier to grab
		this.selected=false;
		//define nested functions
		Slider.prototype.setMargin = function(m){ this.m=m; }
		Slider.prototype.setY = function(y){ this.y=y; }
		Slider.prototype.select = function(){
			if (selectX > (this.a-sliderBar1.width) && selectX < (this.b+sliderBar4.width) && //just bar: Math.abs(selectX-(this.a+(this.b-this.a)*this.value)) <= this.width/2
			selectY > (this.y-this.padding) && selectY < (this.y+sliderBar4.height+this.padding)) {this.selected = true; this.move();}
			else this.selected = false;
		}
		Slider.prototype.release = function(){ this.selected=false; }
		Slider.prototype.move = function() {
			if (this.selected){
				this.value = (selectX-this.a)/(this.b-this.a);
				this.value = this.value > 0 ? this.value : 0;
				this.value = this.value < 1 ? this.value : 1;
			}
		}
		Slider.prototype.update = function(){
			this.a = this.m*canvas.width;
			this.b = (1-this.m)*canvas.width;
		}
		Slider.prototype.draw = function(){
			//draw slider bar
			ctx.drawImage(sliderBar1,this.a-sliderBar1.width,this.y); //left-end
			ctx.drawImage(sliderBar2,this.a,this.y,(this.b-this.a)*this.value,sliderBar2.height); //left
			ctx.drawImage(sliderBar3,this.a+(this.b-this.a)*this.value,this.y,(this.b-this.a)*(1-this.value),sliderBar3.height); //right
			ctx.drawImage(sliderBar4,this.b,this.y); //right-end
			//draw slider
			ctx.drawImage(sliderButton, (this.a+((this.b-this.a)*this.value))-(this.width/2)-2, this.y);
		}
		this.update();
	}
	
	var update = function (modifier) {
		
	}
	// Draw everything
	function render() {
		ctx.clearRect (0,0, canvas.width, canvas.height);
		ctx.globalCompositeOperation = "overlay";
		ctx.drawImage(background,0,0,canvas.width, canvas.height);
		//warm or cold
		ctx.fillStyle = slider2.value < .5 ?
			"rgba(50,0,0,"+(Math.abs((slider2.value)-.5))+")" :
			"rgba(0,0,50,"+(Math.abs((slider2.value)-.5))+")";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		//brightness
		ctx.fillStyle = slider1.value < .5 ?
			"rgba(0,0,0,"+(Math.abs((slider1.value)-.5)*1)+")" :
			"rgba(255,255,255,"+(Math.abs((slider1.value)-.5)*1)+")";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.globalCompositeOperation = "source-over";
		//draw icons first
		ctx.drawImage(icon1, slider1.a-48, slider1.y-6);
		ctx.drawImage(icon2, slider1.b+16, slider1.y-6);
		ctx.drawImage(icon3, slider2.a-48, slider2.y-6);
		ctx.drawImage(icon4, slider2.b+16, slider2.y-6);
		//draw sliders for icons
		slider1.draw();
		slider2.draw();
	};
	// The system loop
	function main() {
		var now = Date.now();
		var delta = now - then;
	
		update(delta / 1000);
		render();
	
		then = now;
	};
	var then = Date.now();
	setInterval(main, 1); // Execute as fast as possible
	
	this.checkWidth = function(){adjustWidth();}
	this.setBackground = function(src){background.src=dir+src;}
	function adjustWidth(){
		canvas.width = document.getElementById(id).offsetWidth;
		slider1.update();
		slider2.update();
	}
	this.getCanvas = function(){ return canvas; }
	this.getId =  function(){ return id; }
	window.addEventListener("resize",function(){adjustWidth();});
}
//initialize everything
timber = new timber();
timber.checkWidth();
document.getElementById(timber.getId()).appendChild(timber.getCanvas());
