let canvasBoard = document.getElementById("canvasBoard");
let playBytton = document.getElementById("play");
let resetButton = document.getElementById("reset");
let Balls = [];
let animationId = null;
let config = [];
let drawedLines = [];
const xDirections = ['LEFT', 'RIGHT']
const yDirections = ['UP', 'DOWN'];

resetButton.addEventListener("click", stopAnimation);
playBytton.addEventListener("click", playAnimation);
canvasBoard.addEventListener("click" , (e) => {
    const position = {
        x: e.clientX,
        y: e.clientY
    }

    findBall(position);
});

canvasBoard.addEventListener("onmousemove", (e) => {
    const position = {
        x: e.clientX,
        y: e.clientY
    }

    console.log(position);
});

class Ball {
    constructor() {
        this.id = generateId(4);
        this.r = parseInt(Math.floor(Math.random() * (50 - 10) + 10));
        this.x = parseInt(Math.random() * ((canvasBoard.width - this.r) - this.r) + this.r);
        this.y = parseInt(Math.random() * ((canvasBoard.height - this.r) - this.r) + this.r);
        this.speedX = parseInt(Math.floor(Math.random() * (5 - 1) + 1));
        this.speedY = parseInt(Math.floor(Math.random() * (5 - 1) + 1));
        this.avgSpeed = (this.speedX + this.speedY) / 2;
        this.xDirection = xDirections[Math.floor(Math.random() * xDirections.length)];
        this.yDriection = yDirections[Math.floor(Math.random() * yDirections.length)];
    }

    calculateCricleField() {
        return parseInt(Math.PI * Math.pow(this.r, 2));
    }

    calculateBallPower() {
        return config.xValue * this.avgSpeed + config.yValue * this.calculateCricleField();
    }

    drawBall(canvasBoard) {
        const ctx = canvasBoard.getContext('2d');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.stroke();
        ctx.save();
    }

    deleteBall() {
        const index = Balls.indexOf(this);
        Balls.splice(index,1);
    }

    moveBall(canvasBoard) {
        if (this.x + this.r + this.speedX >= canvasBoard.width) {
            this.xDirection = "LEFT";
            this.speedX *= -1;
        } else if (this.x - this.r + this.speedX <= 0) {
            this.xDirection = "RIGHT";
            this.speedX *= -1;
        }

        if (this.y + this.r +  this.speedY >= canvasBoard.height) {
            this.up = "UP";
            this.speedY *= -1;
        } else if (this.y - this.r + this.speedY <= 0) {
            this.yDriection = "DOWN";
            this.speedY *= -1;
        }

        this.x += this.speedX;
        this.y += this.speedY;
    }

    drawLines(canvasBoard) {
        Balls.forEach(ball => {
            const distance = distanceBetweenPoints(this, ball);
            if (!(drawedLines.includes(ball.id + "-" + this.id) || drawedLines.includes(this.id + "-" + ball.id))) {
                if (distance <= config.distance && distance != 0) {
                    drawedLines.push(this.id + "-" + ball.id);
                    const context = canvasBoard.getContext("2d");
                    context.beginPath();
                    context.moveTo(this.x, this.y);
                    context.lineTo(ball.x, ball.y);
                    context.stroke();

                    if (this.calculateBallPower() > ball.calculateBallPower()) {
                        this.addEnergy(ball.r, ball.avgSpeed);
                        ball.removeEnergy();
                    } else {
                        this.removeEnergy();
                        ball.addEnergy(this.r, this.avgSpeed);
                    }
                }
            }
        });
    }

    onBallClick() {
        this.deleteBall();
        Balls.push(new Ball());
        Balls.push(new Ball());
    }

    addEnergy(r, avgSpeed) {
        this.r += (config.energySpeed * r) / 100;
        this.speedX -= (config.energySpeed * avgSpeed) / 100;
        this.speedY -= (config.energySpeed * avgSpeed) / 100;
    }

    removeEnergy() {
        this.r -= (config.energySpeed * this.r) / 100;
        this.speedX += (config.energySpeed * this.avgSpeed) / 100;
        this.speedY += (config.energySpeed * this.avgSpeed) / 100;
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
    config = getConfig();
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
    drawedLines = [];
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
    lines = [];
    animationId = setTimeout(function() {
        requestAnimationFrame(moveBalls);
        clearCanvasBoard();
        Balls.forEach(ball => {
            if (ball.calculateCricleField() > 5) {
                ball.moveBall(canvasBoard);
                ball.drawBall(canvasBoard);
                ball.drawLines(canvasBoard);
            } else {
                ball.deleteBall();
            }
        });
    }, 1000 / 60);
}

function distanceBetweenPoints(ball1, ball2) {
    return parseInt(Math.sqrt((ball2.x - ball1.x) ** 2 + (ball2.y - ball1.y) ** 2));
}

function findBall(position) {
    Balls.forEach(ball => {
        if (parseInt(Math.sqrt((position.x - ball.x) ** 2 + (position.y - ball.y) ** 2)) <= ball.r) {
            ball.onBallClick()
        }
    });
}

function generateId(length) {
    let id = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return id;
}