var x, y, a, tmpTop, tmpLeft;
var w, h, ww, wh;
var b = document.getElementById("a12");
var isNeighbor = false;
var speed = 2;
var coordArray = [];
var coordArrayStart = [];
var isMoving = false;

ww = window.innerWidth;
wh = window.innerHeight;

w = 10;
h = 10;
var imgWidth, imgHeight, imgSrc;
document.getElementById("win").style.display = "none";
var image = new Image();
var isGame = false;
var gameDiv = document.getElementById('game');
var original = document.getElementById('original');

gameDiv.style.display = "none";
gameDiv.style.position = "absolute";
gameDiv.style.top = "80px";

//LOADING IMAGE

original.onmouseover = function () {
	if(isGame) document.getElementById('originalImage').style.display = "block";
}
original.onmouseout = function () {
	if(isGame) document.getElementById('originalImage').style.display = "none";
}

function loadButton() {
	document.getElementById('files').click();
}

function imgProcessing(files) {
	dropZone.style.background = "#fff";
	var output = [];
	f = files[0];
	//если это картинка
	if (f.type.match('image.*')) {

		var reader = new FileReader();
	  	reader.onload = (function(theFile) {
			return function(e) {
					image.src = e.target.result;
					imgSrc = e.target.result;

					image.onload = function() {
						document.getElementById('settings').style.display = "block";
						document.getElementById('status').innerHTML = f.name;

							var nImg = document.createElement('img');
							nImg.height = "200";
							nImg.src = image.src;
							document.getElementById('drop_zone').innerHTML = "";
							document.getElementById('drop_zone').style.lineHeight = "0px";
							document.getElementById('drop_zone').style.border = "none";
							document.getElementById('drop_zone').style.borderBottom = "dashed 1px rgba(50, 50, 50, 0.5)";
							document.getElementById('drop_zone').appendChild(nImg);

					imgWidth = this.width;
					imgHeight = this.height;
					if(ww/wh < imgWidth/imgHeight) {
								w = ww-100;
								h = imgHeight*(ww-100)/imgWidth;
					} else {
								w = imgWidth*(wh-100)/imgHeight
								h = wh-100;
					}
					};
			};
		  })(f);
	  reader.readAsDataURL(f);
	}
}
//load image by button click
function handleFileSelect(evt) {
	imgProcessing(evt.target.files);
}
//load image by draging
function dropFileSelect(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	imgProcessing(evt.dataTransfer.files);
}
function restart() {location.reload();}

function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	dropZone.style.background = "#DCEDC8";
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);

var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', dropFileSelect, false);

//BEGIN GAME

function beginGame() {
	var x = document.getElementById("x").value;
	var y = document.getElementById("y").value;
	if(x < 1) x = 1;
	if(y < 1 ) y = 1;
	setTiles(x, y);
	isGame = true;
	gameDiv.style.width = w + "px";
	gameDiv.style.height = h + "px";
	gameDiv.style.left = (ww - w)/2 + "px";


	$("#load").hide(600, function(){
		$("#restart").show(600);
		$("#original").show(600);
		$("#game").show(600);
	});
}

function setTiles(width, height) {

	var styleWidth = w/width;
	var styleHeight = h/height;

	var orImg = document.createElement('img');
	orImg.width = w;
	orImg.height = h;
	orImg.src = image.src;
	orImg.style.display = 'block';
	orImg.id = 'originalImage';
	orImg.style.position = 'absolute';
	orImg.style.zIndex = '2';
	orImg.style.top = '81px';
	orImg.style.left = (ww - w)/2 + 1 + "px";
	document.body.appendChild(orImg);
	document.getElementById('originalImage').style.display = "none";

	for(var i=1; i<=width*height; i++) {
		var newEl = document.createElement('div');
		if(i!=width*height) {
			var newImg = document.createElement('img');
			newImg.width = w;
			newImg.height = h;
			newImg.src = image.src;
			newImg.style.position = 'absolute';
			newImg.style.zIndex = '-1';
		}
		newEl.style.display = "block";
		newEl.style.position = "absolute";
		newEl.style.float = "left";
		newEl.style.overflow = "hidden";
		newEl.style.boxSizing = "border-box";

		newEl.style.border = "solid black 1px";
		newEl.id = 'a'+i;
		newEl.style.width = styleWidth + 'px';
		newEl.style.height = styleHeight + 'px';
		newEl.innerHTML = i;
		//newEl.style.font = (h/height - 24) + 'px bold';
		newEl.style.color = 'rgba(0, 0, 0, 0)';

		//sell coordinates
		var coords = {
			top: 0,
			left: 0
		}
		coords.top = (i-i%width)/width * styleHeight;
		coords.left = (i%width-1) * styleWidth;

		if(i%width==0) {
			coords.top = ((i-i%width)/width-1) * styleHeight;
			coords.left = (width-1) * styleWidth;
		}
		//move the picture
		if(i!=width*height) {
			newImg.style.left = coords.left * -1 -1 + 'px';
			newImg.style.top = coords.top * -1 -1 + 'px';
		}

		if(i!=width*height) {
			newEl.appendChild(newImg);
		}
		coordArray[i]=coords;
		if(i==width*height) {
			newEl.style.background = "rgba(0,0,0,0)";
			newEl.style.border = "none";
			newEl.style.zIndex = -2;
			b = newEl;
		}

		gameDiv.appendChild(newEl);
	}

	for(var i=1; i<=width*height; i++) {
		var coords = {//
			top: 0,
			left: 0
		}
		coords.top = coordArray[i].top;
		coords.left = coordArray[i].left;
		coordArrayStart[i] = coords;
	}

	//console.log(coordArrayStart);

	for (var i = width*height; i > 0; i--) {
		var num = Math.floor(Math.random()*(i + 1));
		if(num == 0) num = 1;

		var d = coordArray[num];
		coordArray[num] = coordArray[i];
		coordArray[i] = d;
	}
	var d = coordArray[15];
	coordArray[15] = coordArray[16];
	coordArray[16] = d;

	for(var i=1; i<=width*height; i++) {

		document.getElementById('a'+i).style.top = coordArray[i].top+'px';
		document.getElementById('a'+i).style.left = coordArray[i].left+'px';

	}
}

document.onclick = function(e) {
	if(isGame) {
		x = event.clientX;
		y = event.clientY;
		// w = window.innerWidth;
		// h = window.innerHeight;

		a = e.target;

		//is empty sell a neighbor
		if(!(Math.abs(parseInt(a.style.top)-parseInt(b.style.top))>=(parseInt(b.style.height)+6))) {

			if(!(Math.abs(parseInt(a.style.left)-parseInt(b.style.left))>=(parseInt(b.style.width)+6))) {

				if((parseInt(a.style.top)==parseInt(b.style.top)) || (parseInt(a.style.left)==parseInt(b.style.left)))
					isNeighbor = true;

			}
		}
		if(a==b) isNeighbor = false;

		//move
		if (isNeighbor) {
			if(!isMoving)
				move(a, b);
			isNeighbor = false;
		}
	}
}
function move(obj1, obj2) {
	var tmpW = obj1.style.left;
	var tmpH = obj1.style.top;
	var interval;
	if(parseInt(obj2.style.top)>parseInt(obj1.style.top)) {
		isMoving = true;
		interval = setInterval(function() {
			tmp = parseInt(obj1.style.top, 10) + h/100*speed;
			obj1.style.top = tmp + "px";

			if(parseInt(obj2.style.top)<=parseInt(obj1.style.top)) {
				clearInterval(interval);
				obj1.style.top = obj2.style.top;
				obj2.style.left = tmpW;
				obj2.style.top = tmpH;
				isMoving = false;
				isWin();
			}
		}, 30);
	} else if(parseInt(obj2.style.top)<parseInt(obj1.style.top)) {
		isMoving = true;
		interval = setInterval(function() {
			tmp = parseInt(obj1.style.top, 10) - h/100*speed;
			obj1.style.top = tmp + "px";

			if(parseInt(obj2.style.top)>=parseInt(obj1.style.top)) {
				clearInterval(interval);
				obj1.style.top = obj2.style.top;
				obj2.style.left = tmpW;
				obj2.style.top = tmpH;
				isMoving = false;
				isWin();
			}
		}, 30);
	} else if(parseInt(obj2.style.left)>parseInt(obj1.style.left)) {
		isMoving = true;
		interval = setInterval(function() {
			tmp = parseInt(obj1.style.left, 10) + w/100*speed;
			obj1.style.left = tmp + "px";

			if(parseInt(obj2.style.left)<=parseInt(obj1.style.left)) {
				clearInterval(interval);
				obj1.style.left = obj2.style.left;
				obj2.style.left = tmpW;
				obj2.style.top = tmpH;
				isMoving = false;
				isWin();
			}
		}, 30);
	} else if(parseInt(obj2.style.left)<parseInt(obj1.style.left)) {
		isMoving = true;
		interval = setInterval(function() {
			tmp = parseInt(obj1.style.left, 10) - w/100*speed;
			obj1.style.left = tmp + "px";

			if(parseInt(obj2.style.left)>=parseInt(obj1.style.left)) {
				clearInterval(interval);
				obj1.style.left = obj2.style.left;
				obj2.style.left = tmpW;
				obj2.style.top = tmpH;
				isMoving = false;
				isWin();
			}
		}, 30);
	}

}

function isWin() {
	console.log("checking ");
	for(var i=1; i<coordArrayStart.length; i++) {
		if(document.getElementById('a'+i).style.top != Math.round(coordArrayStart[i].top*1000)/1000+'px' ||
			document.getElementById('a'+i).style.left != Math.round(coordArrayStart[i].left*1000)/1000+'px')
			return false;
	}
	youWin();
}

function youWin() {
	console.log("win");
	$("#game").hide(600, function() {
		$("#win").show(600);
	});
}
