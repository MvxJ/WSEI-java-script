let canvasBoard = document.getElementById("canvasBoard");
let playBytton = document.getElementById("play");
let resetButton = document.getElementById("reset");

resetButton.addEventListener("click", clearCanvasBoard);
playBytton.addEventListener("click", playAnimation);

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

    clearCanvasBoard();
    for (var i = 0; i < parseInt(config.numberOfBalls); i++) {
        drawBall();
    }
}

function clearCanvasBoard() {
    const context = canvasBoard.getContext('2d');
    context.clearRect(0, 0, canvasBoard.width, canvasBoard.height);
}

function drawBall() {
    const context = canvasBoard.getContext('2d');
    const size = getBallSize();
    const x = getRandomCoordinates(size, canvasBoard.width);
    const y = getRandomCoordinates(size, canvasBoard.height);
    context.beginPath();
    context.arc(x, y, size, 0, 2 * Math.PI);
    context.stroke();
    context.save();
}

function getBallSize() {
    return parseInt(Math.floor(Math.random() * 50));
}

function getRandomCoordinates(ballSize, canvasWidth) {
    return Math.random() * ((canvasWidth - ballSize) - ballSize) + ballSize;
}

function drawBeginBoard();