const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameWidth = canvas.width = 400;
const gameHeight = canvas.height = 300;
const paddleWidth = 80;
const ballDiameter = 10;
const brickWidth = 50;
const brickHeight = 20;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickSpacing = 2;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let ballPositionX = gameWidth / 2;
let ballPositionY = gameHeight - 30;
let ballSpeedX = 2;
let ballSpeedY = -2;
let paddlePosition = (gameWidth - paddleWidth) / 2;
let bricks = [];

// Create bricks array
for (let row = 0; row < brickRowCount; row++) {
    bricks[row] = [];
    for (let col = 0; col < brickColumnCount; col++) {
        bricks[row][col] = { x: 0, y: 0, status: 1 };
    }
}

// Function to draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballPositionX, ballPositionY, ballDiameter / 2, 0, Math.PI * 2);
    ctx.fillStyle = "#f00";
    ctx.fill();
    ctx.closePath();
}

// Function to draw the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddlePosition, gameHeight - 10, paddleWidth, 10);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.closePath();
}

// Function to draw bricks
function drawBricks() {
    for (let row = 0; row < brickRowCount; row++) {
        for (let col = 0; col < brickColumnCount; col++) {
            if (bricks[row][col].status === 1) {
                const brickX = col * (brickWidth + brickSpacing) + brickOffsetLeft;
                const brickY = row * (brickHeight + brickSpacing) + brickOffsetTop;
                bricks[row][col].x = brickX;
                bricks[row][col].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#00f";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Function to detect collisions with bricks
function collisionDetection() {
    for (let row = 0; row < brickRowCount; row++) {
        for (let col = 0; col < brickColumnCount; col++) {
            const brick = bricks[row][col];
            if (brick.status === 1) {
                if (
                    ballPositionX > brick.x && ballPositionX < brick.x + brickWidth &&
                    ballPositionY > brick.y && ballPositionY < brick.y + brickHeight
                ) {
                    ballSpeedY = -ballSpeedY;
                    brick.status = 0;
                }
            }
        }
    }
}

// Function to update the ball's position
// Function to update the ball's position
function updateBallPosition() {
    ballPositionX += ballSpeedX;
    ballPositionY += ballSpeedY;

    // Check for collisions with the walls
    if (ballPositionX < ballDiameter / 2 || ballPositionX > gameWidth - ballDiameter / 2) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballPositionY < ballDiameter / 2) {
        ballSpeedY = -ballSpeedY;
    }

    // Check for collisions with the paddle
    if (ballPositionY + ballDiameter / 2 >= gameHeight - 10) {
        if (ballPositionX >= paddlePosition && ballPositionX <= paddlePosition + paddleWidth) {
            ballSpeedY = -ballSpeedY;
        } else {
            // Game over
            alert("Game Over!");
            document.location.reload();
        }
    }

    collisionDetection();

    // Move the ball
    drawBall();

    // Request the next animation frame
    requestAnimationFrame(updateBallPosition);
}

// Function to update the paddle's position
function updatePaddlePosition(event) {
    const mouseX = event.clientX - canvas.offsetLeft;
    paddlePosition = mouseX - paddleWidth / 2;
    if (paddlePosition < 0) {
        paddlePosition = 0;
    }
    if (paddlePosition > gameWidth - paddleWidth) {
        paddlePosition = gameWidth - paddleWidth;
    }
}

// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
}

// Main game loop
function draw() {
    clearCanvas();
    drawBricks();
    drawBall();
    drawPaddle();
    requestAnimationFrame(draw);
}

// Event listener for paddle movement
document.addEventListener("mousemove", updatePaddlePosition);

// Start the game
draw();
