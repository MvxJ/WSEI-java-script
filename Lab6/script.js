let canvasBoard = document.getElementById("canvasBoard");
let playBytton = document.getElementById("play");
let resetButton = document.getElementById("reset");
let Balls = [];
let animationId = null;

resetButton.addEventListener("click", stopAnimation);
playBytton.addEventListener("click", playAnimation);
canvasBoard.addEventListener("click" , (e) => {
    const position = {
        x: e.clientX,
        y: e.clientY
    }
});

class Ball {
    constructor() {
        this.r = parseInt(Math.floor(Math.random() * 30));
        this.x = parseInt(Math.random() * ((canvasBoard.width - this.r) - this.r) + this.r);
        this.y = parseInt(Math.random() * ((canvasBoard.height - this.r) - this.r) + this.r);
        this.speed = parseInt(Math.floor(Math.random() * (10 - 1) + 1));;
    }

    drawBall(canvasBoard) {
        const ctx = canvasBoard.getContext('2d');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.save();
    }

    moveBall() {
        if (
            this.x + this.speed >= canvasBoard.width || 
            this.y + this.speed >= canvasBoard.height ||
            this.y + this.speed <= 0 ||
            this.x + this.speed <= 0
        ) {
            this.speed *= -1;
        }
        
        this.x += this.speed;
        this.y += this.speed;
    }
}

function getConfig() {
    return {
        yValue: document.getElementById("yValue").value ?? 0,
        xValue: document.getElementById("xValue").value ?? 0,
        energySpeed: document.getElementById("energySpeed").value ?? 0,
        mouseEffectRepulsion: document.getElementById("repulsionEffect").checked ? true : false,
        distance: document.getElementById("distanceValue").value ?? 0,
        numberOfBalls: document.getElementById("numberOfBalls").value ?? 0,
        mouseEffectPower: document.getElementById("powerOfMouseEffect").value ?? 0
    }
}

function playAnimation() {
    const config = getConfig();
    drawBeginBoard(config.numberOfBalls);
    moveBalls();
}

function stopAnimation() {
    if (animationId) {
        clearTimeout(animationId);
        clearCanvasBoard();
        Balls = [];
    }
}

function clearCanvasBoard() {
    const context = canvasBoard.getContext('2d');
    context.clearRect(0, 0, canvasBoard.width, canvasBoard.height);
}

function drawBeginBoard(numberOfBalls) {
    for (var i = 0; i < parseInt(numberOfBalls); i++) {
        var ball = new Ball();
        ball.drawBall(canvasBoard);
        Balls.push(ball);
    }
}

function moveBalls() {
    animationId = setTimeout(function() {
        requestAnimationFrame(moveBalls);
        clearCanvasBoard();
        Balls.forEach(ball => {
            ball.moveBall();
            ball.drawBall(canvasBoard);
        });
    }, 1000 / 60);
}

function intersect(point1, point2, searchLength) {
    return parseInt(Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2)) <= searchLength;
}