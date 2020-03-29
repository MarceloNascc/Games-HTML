const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const square = 18;
const squareQuantity = 32;

const score = document.getElementById('score');

function Stage() {
  this.draw = function () {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, squareQuantity * square, squareQuantity * square);
  }
}

function Snake() {
  this.snakeBody = [];
  this.snakeBody[0] = {
    x: 0,
    y: 0,
    eat: false
  };

  this.direction = 'right';

  this.draw = function () {
    ctx.fillStyle = '#378234';
    ctx.fillRect(this.snakeBody[0].x, this.snakeBody[0].y, square, square);

    for (let posSnakeBody = 1; posSnakeBody < this.snakeBody.length; posSnakeBody++) {
      if (this.snakeBody[posSnakeBody].x !== this.snakeBody[0].x ||
        this.snakeBody[posSnakeBody].y !== this.snakeBody[0].y) {
        ctx.fillStyle = this.snakeBody[posSnakeBody].eat ? '#AA7000' : '#48bc42';
        ctx.fillRect(this.snakeBody[posSnakeBody].x + 1, this.snakeBody[posSnakeBody].y + 1, square - 2, square - 2);
      } else {
        clearInterval(interval);
      }
    }
  };

  this.setDirection = function ({ keyCode: direction }) {
    switch (direction) {
      case 37:
        if (this.direction != 'right') {
          this.direction = 'left';
        }
        break;

      case 38:
        if (this.direction != 'down') {
          this.direction = 'up';
        }
        break;

      case 39:
        if (this.direction != 'left') {
          this.direction = 'right';
        }
        break;

      case 40:
        if (this.direction != 'up') {
          this.direction = 'down';
        }
        break;
    }
  };

  this.verifyLimits = function () {
    if (this.snakeBody[0].x > square * (squareQuantity - 1)) {
      this.snakeBody[0].x = 0;
    } else if (this.snakeBody[0].x < 0) {
      this.snakeBody[0].x = square * (squareQuantity - 1);
    }

    if (this.snakeBody[0].y > square * (squareQuantity - 1)) {
      this.snakeBody[0].y = 0;
    } else if (this.snakeBody[0].y < 0) {
      this.snakeBody[0].y = square * (squareQuantity - 1);
    }
  };

  this.nextPosition = function (apple) {
    let headSnake = {
      x: this.snakeBody[0].x,
      y: this.snakeBody[0].y,
      eat: false
    };

    if (headSnake.x != apple.x || headSnake.y != apple.y) {
      this.snakeBody.pop();
    } else {
      score.innerText = parseInt(score.innerText) + 10;

      headSnake.eat = true;

      apple.x = Math.floor(Math.random() * (squareQuantity - 1) + 1) * square;
      apple.y = Math.floor(Math.random() * (squareQuantity - 1) + 1) * square;
    }

    switch (this.direction) {
      case 'right':
        headSnake.x += square;
        break;
      case 'down':
        headSnake.y += square;
        break;
      case 'left':
        headSnake.x -= square;
        break;
      case 'up':
        headSnake.y -= square;
        break;
    }

    this.snakeBody.unshift(headSnake);
  };
}

function Apple() {
  this.x = Math.floor(Math.random() * (squareQuantity - 1) + 1) * square;
  this.y = Math.floor(Math.random() * (squareQuantity - 1) + 1) * square;

  this.draw = function () {
    ctx.fillStyle = '#E02041';
    ctx.fillRect(this.x, this.y, square, square);
  }
}

const snake = new Snake();
const stage = new Stage();
const apple = new Apple();

window.onkeydown = (event) => snake.setDirection(event);

function game(stage, snake, apple) {
  snake.verifyLimits();

  stage.draw();
  snake.draw();
  apple.draw();

  snake.nextPosition(apple);
}

const interval = setInterval(() => game(stage, snake, apple), 100);