// 代码写得很乱。。
var ctx;
var border_img = new Image();
border_img.src = "img/border_wall.png";
var ball_img = new Image();
ball_img.src = "img/ball.jpg";
var screen_count = 1;//计算当前屏幕
var screen_count_max = 2;
var screen_count_min = 1;
var background1_img = new Image();
background1_img.src = "img/background1.jpg";
var background2_img = new Image();
background2_img.src = "img/background2.jpg";
var can_img = new Image();
can_img.src = "img/rubbish.png";
// var cwidth = 864;
// var cheight = 664;
// var inwidth = 800;
// var inheight = 600;
// var everything = [];
// var border = 32;
//皮球压扁
//调用关系：当前位置保存在球对象里面，moveball方法根据球的当前位置计算出下一阶段位置
//由draw调用参数画

/* Sprite 精灵类 */
function Sprite(location_x,location_y,width,height,vx,vy,img) {
	this.location_x = location_x;
	this.location_y = location_y;
	this.width = width;
	this.height = height;
	this.vx = vx;
	this.vy = vy;
	this.img = img;
}
Sprite.prototype.move = function() {
	// body...
}; /*所有的Sprite实例都将重写move方法*/

// 寄生组合式继承函数,js真的是一个很有意思的语言,这是一种处理继承的方法，其实ES6里已经有原生的class语法，
// 但其实只是一个语法糖，内部实现也是通过原型链的手法
function inheritPrototype(subType,superType) {
	var prototype = superType.prototype;
	prototype.constructor = subType;
	subType.prototype = prototype;	
}

function Ball(ball_location_x,ball_location_y,ballwidth
	,ballheight,ballvx,ballvy,img) {
	Sprite.call(this,ball_location_x,ball_location_y,ballwidth
	,ballheight,ballvx,ballvy,img);
	this.ballrad = ballwidth/2;
}
inheritPrototype(Ball,Sprite);
Ball.prototype.move = function(){
		var nballx = this.location_x+this.vx;
		var nbally = this.location_y+this.vy;
		if(this.width<2*this.ballrad) this.width+=0.02*this.ballrad;
		if(this.height<2*this.ballrad) this.height+=0.02*this.ballrad;
		if(nballx + this.ballrad > 832){
			if(screen_count==screen_count_max){
				this.vx = -this.vx;
				nballx = 832-this.ballrad;
				this.width = this.ballrad;
			}
			else{
				nballx = 32 + this.ballrad;
				screen_count++;
			}
		}
		if(nballx - this.ballrad < 32){
			if(screen_count==screen_count_min){
				this.vx = -this.vx;
				nballx = 32+this.ballrad;
				this.width = this.ballrad;
			}
			else{
				nballx = 832 - this.ballrad;
				screen_count--;
			}
		}
		if(nbally + this.ballrad > 632){
			this.vy = -this.vy;
			nbally = 632-this.ballrad;
			this.height = this.ballrad;
		}
		if(nbally - this.ballrad < 32){
			this.vy = -this.vy;
			nbally = 32+this.ballrad;
			this.height = this.ballrad;
		}
		this.location_x = nballx;
		this.location_y = nbally;
	};
/* end of ball */
// var ball = new Ball(50,50,20);
function init() {
	ctx = document.getElementById("canvas").getContext("2d");
	var temp1 = document.getElementById("introduction");
	var temp2 = document.getElementById("start_game");
	if(temp1&&temp2){
		temp1.parentNode.removeChild(temp1);
		temp2.parentNode.removeChild(temp2);
	}
	ctx.font = "Bold 40px Microsoft Yahei"
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	// var initialballx = Math.random()*
	// var initialbally = Math.random()*
	// var ball_img = new Image();
	// ball_img.src = "img/ball.jpg"
	var ball = new Ball(100,100,64,64,3,5,ball_img);
	var can = new Sprite(700,632-64,128,128,0,0,can_img);
	// var person = Person();
	drawall(ball,can);
}
function drawall(thing1,thing2) {
	// var temp = drawall.bind(this,ball); 这是解决问题的第一种方法
	ctx.clearRect(0,0,864,664);
	drawBorder();
	if(screen_count==1){
		ctx.drawImage(background1_img,32,32,800,600);
	}
	else{
		ctx.drawImage(background2_img,32,32,800,600);
		ctx.save();
		ctx.translate(thing2.location_x-thing2.width/2,thing2.location_y-thing2.height/2);
		ctx.rotate(-Math.PI/6);
		ctx.drawImage(thing2.img,0,0,thing2.width,thing2.height);
		ctx.restore();
	}
	thing1.move();
	ctx.drawImage(thing1.img,thing1.location_x-thing1.ballrad,
		thing1.location_y-thing1.ballrad,thing1.width,thing1.height);
	var pauseid = requestAnimationFrame(function() {
		drawall(thing1,thing2);
	});
	if(screen_count==2 && (thing1.location_x > thing2.location_x-thing2.width/2 &&
			thing1.location_x < thing2.location_x+thing2.width/2) &&
			(thing1.location_y > thing2.location_y-thing2.height/2 &&
				thing1.location_y < thing2.location_y+thing2.height/2)){
			ctx.fillText("叶炳健被扔进去了！！",432,332);
			cancelAnimationFrame(pauseid);
	}
}
function drawBorder() {
	var fill_pat = ctx.createPattern(border_img,"repeat");
	ctx.fillStyle = fill_pat;
	ctx.fillRect(0,0,832,32);
	ctx.fillRect(832,0,32,632);
	ctx.fillRect(32,632,832,32);
	ctx.fillRect(0,32,32,632);
}

/*
movement = requestAnimationFrame(animate)
if (stuff) {
	cancelAnimationFrame(movement);
}*/

/*function draw() {

}
function clear() {

}
function moveball() {

}
function check() {

}
function Person() {
	move:moveperson
}
function moveperson() {

}*/
// addHandler()
