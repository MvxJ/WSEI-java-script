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
}

function clearCanvasBoard() {
    const context = canvasBoard.getContext('2d');
    context.clearRect(0, 0, canvasBoard.width, canvasBoard.height);
}

function drawBall() {
    
}