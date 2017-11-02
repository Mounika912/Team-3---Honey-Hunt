var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var gameStates = { "active": 0, "paused": 1, "win": 2, "gameover": 3 };
Object.freeze(gameStates);

var dx = 2;
var dy = -2;

var ballRadius = 10;
var ballColour = "#0095DD";

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleY = (canvas.height - paddleHeight) - 10;

var ballX = canvas.width / 2;
var ballY = paddleY - (ballRadius * 2);

var rightPressed = false;
var leftPressed = false;

var gameState = gameStates.active;

var destroyedBricksCount = 0;
var score = 0;
var lives = 3;
var c= 0;
var pointSound = new sound("beep.mp3", 0.4);
var lifeLostSound = new sound("life-lost.mp3", 0.4);
var gameOverSound = new sound("game-over.mp3");
var winSound = new sound("win.mp3");

var playSound = true;

var brickRowCount = 4;
var brickColumnCount = 9
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;






var brickOffsetLeft = 30;
var hexHeight,
    hexRadius,
    hexRectangleHeight,
    hexRectangleWidth,
    hexagonAngle = 0.523598776, // 30 degrees in radians
    sideLength = 29,
    boardWidth = 8,
    boardHeight = 3;

    hexHeight = Math.sin(hexagonAngle) * sideLength;
    hexRadius = Math.cos(hexagonAngle) * sideLength;
    hexRectangleHeight = sideLength + 2 * hexHeight;
    hexRectangleWidth = 2 * hexRadius;
	console.log(hexRectangleWidth/2)
	console.log(sideLength/2)

var bricks = [];
for (column = 0; column < brickColumnCount; column++) {
    bricks[column] = [];
    for (row = 0; row < brickRowCount; row++) {
        bricks[column][row] = { x: 0, y: 0, status: getRandomBrickStatus() };
    }
}

function getRandomBrickStatus() {
    min = 1;
    max = 3;
    var x;
	x = Math.floor(Math.random() * (max - min + 1)) + min;
	if(x == 3 && c<=4 ){
		c++;
		if(c==4){ return Math.floor(Math.random() * (max - min + 1)) + min;}else{ min =1; max = 2; return Math.floor(Math.random() * (max - min + 1)) + min; }
		
	}else{ min =1; max = 2; return Math.floor(Math.random() * (max - min + 1)) + min; }
	if(x<=2){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

function getBrickColour(status) {
    switch (status) {
        case 1:
            return "#FFA500";
        case 2:
            return "#FFD700";
        case 3:
            return "#8B4513";
		
    }
}

function keyDownHandler(e) {
	console.log('down')
    if (e.keyCode == 39) {
		console.log('downright')
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
		console.log('downleft')
        leftPressed = true;
    }
    else if (e.keyCode == 32) {
        togglePauseGame();
    }
    else if (e.keyCode == 82) {
        resetGame();
    }
    else if (e.keyCode == 83) {
        toggleAudio();
    }
}
function keyUpHandler(e) {
	console.log('up')
    if (e.keyCode == 39) {
		console.log('upright')
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
		console.log('upleft')
        leftPressed = false;
    }
}
function mouseMoveHandler(e) {
    if (gameState === gameStates.active) {
        movePaddleByClientX(e.clientX);
    }
}

function touchMoveHandler(e) {
    if (gameState === gameStates.active) {
        e.preventDefault();

        var touches = e.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            movePaddleByClientX(touch.clientX);
        }
    }
}

function movePaddleByClientX(clientX) {
    var relativeX = clientX - canvas.offsetLeft;
    if (relativeX > 0 && (relativeX + (paddleWidth / 2)) < canvas.width) {
        var newX = relativeX - paddleWidth / 2;

        if (newX <= 0) {
            paddleX = 0;
        } else if (newX >= canvas.width) {
            paddleX = canvas.width;
        } else {
            paddleX = newX;
        }
    }
}

function collisionDetection() {
    brickCollisionDetection();
    wallCollisionDetection();
}

function brickCollisionDetection() {
    for (column = 0; column < brickColumnCount; column++) {
        for (row = 0; row < brickRowCount; row++) {
            var b = bricks[column][row];

            if (b.status > 0) {
                if (ballX > b.x && ballX < b.x + hexRectangleWidth && ballY > b.y && ballY < b.y + sideLength) {
                    dy = -dy;
					if(b.status ==3){
						
						b.status = 1;
											
						
					}
                    b.status--;

                    if (b.status == 0) {
						console.log('destroy')
                        destroyedBricksCount++; 
                    }

                    score++;

                    if (playSound) {
                        pointSound.play();
                    }
                    if (destroyedBricksCount == brickRowCount * brickColumnCount) {
                        if (playSound) {
                            winSound.play();
                        }
                        gameState = gameStates.win;
                    }
                }
            }
        }
    }
}

function wallCollisionDetection() {
    if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
        dx = -dx;
    }

    if (ballY + dy < ballRadius) {
        dy = -dy;
    } else if (ballY + dy > paddleY - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            dy = -dy;
            if (playSound) {
                pointSound.play();
            }
        }
        else {
            lives--;

            if (!lives) {
                if (playSound) {
                    gameOverSound.play();
                }
                gameState = gameStates.gameover;
            } else {
                if (playSound) {
                    lifeLostSound.play();
                }
                ballX = canvas.width / 2;
                ballY = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColour;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawMenu() {
    drawOverlay("Game Paused!");
}

function drawGameOver() {
    drawOverlay("Game Over!");
}
function drawWin() {
    drawOverlay("You Win!");
}

function drawBricks() {
	
    for (column = 0; column < brickColumnCount; column++) {
        for (row = 0; row < brickRowCount; row++) {
            var brick = bricks[column][row];
			
            if (brick.status > 0 ) {
                /* var x = (column * (hexRectangleWidth + brickPadding)) + brickOffsetLeft;
                var y = (row * (sideLength + brickPadding)) + brickOffsetTop; */
				
				var x = column * (hexRectangleWidth+4) + (( row% 2) * hexRadius),
                    y = row * (sideLength + hexHeight+4);
				
				
                brick.x = x;
                brick.y = y;

                ctx.beginPath();
                ctx.rect(x, y+hexHeight, hexRectangleWidth, sideLength);
                ctx.fillStyle = getBrickColour(brick.status);
                ctx.fill();
                ctx.closePath();
				
				ctx.moveTo(x + hexRadius, y);
        ctx.lineTo(x + hexRectangleWidth, y + hexHeight);
        ctx.lineTo(x + hexRectangleWidth, y + hexHeight + sideLength);
        ctx.lineTo(x + hexRadius, y + hexRectangleHeight);
        ctx.lineTo(x, y + sideLength + hexHeight);
        ctx.lineTo(x, y + hexHeight);
		//canvasContext.stroke();
		ctx.fillStyle = getBrickColour(brick.status);
		//canvasContext.fillStyle = "red"
		ctx.fill();
		ctx.closePath();
            }
			
			
    }
}
}

function drawScore() {
    ctx.beginPath();
    ctx.font = "16px Courier New";
    ctx.fillStyle = "#0095DD";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 10, 20);
    ctx.closePath();
}
function drawLives() {
    ctx.beginPath();
    ctx.font = "16px Courier New";
    ctx.fillStyle = "#0095DD";
    ctx.textAlign = "right";
    ctx.fillText("Lives: " + lives, canvas.width - 10, 20);
    ctx.closePath();
}

function drawSoundState() {
    var state = playSound ? "On" : "Off";

    ctx.beginPath();
    ctx.font = "16px Courier New";
    ctx.fillStyle = "#0095DD";
    ctx.textAlign = "center";
    ctx.fillText("Sound: " + state, canvas.width / 2, 20);
    ctx.closePath();
}

function drawOverlay(text) {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,.2)";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "30px Courier New";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    ctx.closePath();
}


function movePaddle() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
		console.log('movepaddleright')
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
		console.log('movepaddleleft')
        paddleX -= 7;
    }
}

function togglePauseGame() {
    if (gameState === gameStates.active) {
        gameState = gameStates.paused;
    } else if (gameState === gameStates.paused) {
        gameState = gameStates.active;
    }
}

function restartGame() {
    document.location.reload();
}

function toggleAudio() {
    if (gameState === gameStates.active || gameState === gameStates.paused) {
        playSound = !playSound;
    }
}

; (function () {
    function registerInputControls() {
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        document.addEventListener("mousemove", mouseMoveHandler, false);
        document.addEventListener("touchmove", touchMoveHandler, {passive: false, capture: false});
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();

        switch (gameState) {
            case gameStates.win:
                drawWin();
                break;
            case gameStates.gameover:
                drawGameOver();
                break;
            case gameStates.paused:
                drawMenu();
                break;
            case gameStates.active:
                collisionDetection();
                movePaddle();

                ballX += dx;
                ballY += dy;
        }

        drawSoundState();
        drawScore();
        drawLives();

        requestAnimationFrame(draw);
    }

    registerInputControls();
    draw();
})();

function sound(src, volume) {
    this.sound = document.createElement("audio");
    this.sound.src = src;

    if (volume && volume > 0) {
        this.sound.volume = volume;
    }

    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function (volume) {

        if (volume && volume > 0) {
            this.sound.volume = volume;
        }


        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}