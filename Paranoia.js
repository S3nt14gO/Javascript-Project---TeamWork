var canvas = document.getElementById('ParaCanvas');
var ctx = canvas.getContext('2d');

var x = canvas.width/2;
var y = canvas.height ;
var dx = 7;
var dy = -7;
var ballRadius = 15;
var paddleHeight = 30;
var paddleWidth = 200
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 4;
var brickColumnCount = 8;
var brickWidth = 143;
var brickHeight = 30;
var brickPadding = 20;
var brickOffsetTop = 30;
var brickOffsetLeft = 15;
var score = 0;
var lives = 4;
var GameOver=document.getElementById("GameOver")
var Killed=document.getElementById("Killed")
var Hit=document.getElementById("Hit")
var bricks = [];
for (c=0; c<brickColumnCount; c++) {
	bricks[c] = [];
	for (r=0; r<brickRowCount; r++) {
		bricks[c][r] = {x: 0, y:0, status: 1};
	}
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function drawBricks() {
	for(c=0; c<brickColumnCount; c++) {
		for(r=0; r<brickRowCount; r++) {
			if(bricks[c][r].status == 1) {
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "black";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function keyDownHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = true;
	}
	else if(e.keyCode == 37) {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = false;
	}
	else if(e.keyCode == 37) {
		leftPressed = false;
	}
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

function collisionDetection() {
	for(c=0; c<brickColumnCount; c++){
		for(r=0; r<brickRowCount; r++){
			var b = bricks[c][r];
			if(b.status  == 1) {
				if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
					Hit.play()
					dy = -dy;
					b.status = 0;
					score++;
					if(score == brickRowCount*brickColumnCount) {
						alert("You win , Bravo <3");
						document.location.reload();
					}
				}
			}
		}
	}
}

function drawScore () {
	ctx.font = "20px cursive";
	ctx.fillStyle = "darkred";
	ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
	ctx.font = "20px cursive";
	ctx.fillStyle = "darkred";
	ctx.fillText("Lives: "+lives, canvas.width-85, 20);
}

function draw() {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	drawBricks()
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
	collisionDetection();

	if(y + dy < ballRadius) {
		dy = -dy;
	} else if (y + dy > canvas.height-ballRadius) {
		if(x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		} else {
			Killed.play()
			lives--;
			if(lives==0) {
				alert("You Lose , try again!");
				document.location.reload();
			} else {
				x = canvas.width/2;
				y = canvas.height-30;
				dx = 7;
				dy = -7;
				paddleX = (canvas.width-paddleWidth)/2;
			}
		}
	}
	if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}

	if(rightPressed && paddleX < canvas.width-paddleWidth) {
		paddleX += 7;
	}
	else if(leftPressed && paddleX > 0) {
		paddleX -= 7;
	}

	x += dx;
	y += dy;
	requestAnimationFrame(draw);
}

canvas.addEventListener("mousemove", mouseMoveHandler);

function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if(relativeX > 0+paddleWidth/2 && relativeX < canvas.width-paddleWidth/2) {
		paddleX = relativeX - paddleWidth/2;
	}
}


var NewGameHandler=document.getElementById("ParaNewGame")
NewGameHandler.addEventListener("click", function(){
draw();
NewGameHandler.style.display="none"
var imgsrc='./media/Gradient.png'
canvas.style.backgroundImage='url('+imgsrc+')';
})
