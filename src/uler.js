const prompt = require('prompt-sync')();

const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 20;
const SNAKE_SIZE = 3;

let snake = [];
let apple = [];
let direction = 'right';
let score = 0;
let isPlaying = true;

const init = () => {
  snake = [{ x: Math.floor(BOARD_WIDTH / 2), y: Math.floor(BOARD_HEIGHT / 2) }];
  for (let i = 1; i <= SNAKE_SIZE - 1; i++) {
    snake.push({ x: snake[0].x - i, y: snake[0].y });
  }
  placeApple();
  draw();
}

const placeApple = () => {
  do {
    apple = {
      x: Math.floor(Math.random() * BOARD_WIDTH),
      y: Math.floor(Math.random() * BOARD_HEIGHT),
    };
  } while (isColliding(apple));
}

const isColliding = (object) => {
  return (
    object.x < 0 ||
    object.x >= BOARD_WIDTH ||
    object.y < 0 ||
    object.y >= BOARD_HEIGHT ||
    snake.some((segment) => segment.x === object.x && segment.y === object.y)
  );
}

const draw = () => {
  process.stdout.write('\x1bc');

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      let char = ' ';

      if (y === 0) {
        char = '‾';
      }
      if (y === BOARD_HEIGHT - 1) {
        char = '_';
      }
      if (x === 0) {
        char = '▏';
      }
      if (x === BOARD_WIDTH - 1) {
        char = '▕';
      }
      if (snake.some((segment) => segment.x === x && segment.y === y)) {
        if (snake[0].x === x && snake[0].y === y) {
          char = '\x1b[31mo\x1b[0m'; // Red head
        } else {
          char = 'o';
        }
      } else if (apple.x === x && apple.y === y) {
        char = '@';
      }
      process.stdout.write(char);
    }
    process.stdout.write('\n');
  }

  console.log(`Score: ${score}`);
}

const update = () => {
  if (!isPlaying) {
    return;
  }

  const newHead = {
    x: snake[0].x,
    y: snake[0].y,
  };

  switch (direction) {
    case 'up':
      newHead.y--;
      break;
    case 'down':
      newHead.y++;
      break;
    case 'left':
      newHead.x--;
      break;
    case 'right':
      newHead.x++;
      break;
  }

  if (isColliding(newHead)) {
    gameOver();
    return;
  }

  snake.unshift(newHead);

  if (newHead.x === apple.x && newHead.y === apple.y) {
    score++;
    placeApple();
  } else {
    snake.pop();
  }

  draw();
}

const gameOver = () => {
  console.log('Game Over!');
  console.log(`Score: ${score}`);
  process.exit();
}

const handleKey = () => {
  const key = prompt('Tekan tombol (W/A/S/D) untuk bergerak dan Q untuk keluar : ');
  if (key.toLowerCase() === 'q') {
    console.log('Terima kasih telah bermain!');
    process.exit();
  } else {
    const newDirection = {
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
    }[key.toLowerCase()];

    if (newDirection && newDirection !== direction) {
      direction = newDirection;
    }
  }
}

init();
setInterval(update, 100);
setInterval(handleKey, 100);
