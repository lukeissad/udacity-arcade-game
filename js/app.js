const gameEnd = $('.game-end');
const endParagraph = $('.end-paragraph');
let points = 0;
let life = 3;

// Enemies our player must avoid
class Enemy {
  constructor() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -100;
    this.y = 56 + (83 * Math.floor(Math.random() * 3));
    this.speed = Math.floor(Math.random() * 10) + 1;
  }
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += 40 * this.speed * dt;
    this.collision();
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

// 2D collision detection taken from: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  collision() {
    const playerBox = {x: player.x, y: player.y, width: 76, height: 83};
    const enemyBox = {x: this.x, y: this.y, width: 76, height: 83};

    if (playerBox.x < enemyBox.x + enemyBox.width &&
      playerBox.x + playerBox.width > enemyBox.x &&
      playerBox.y < enemyBox.y + enemyBox.height &&
      playerBox.height + playerBox.y > enemyBox.y) {
        player.restart();
        hearts.pop();
        life--;
        if (life === 0) {
          lose();
        }
    }
  }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
  constructor() {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 388;
  }

  update() {
    if (player.y < 27) {
      points++;
      this.restart();
    }
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

// Moves the player character to the direction chosen, but doesn't allow them to move off screen.
  handleInput(key) {
    if (key === 'right' && this.x < 404) {
      this.x += 101;
    } else if (key === 'left' && this.x > 0) {
      this.x -= 101;
    } else if (key === 'up' && this.y > 0) {
      this.y -= 83;
    } else if (key === 'down' && this.y < 315) {
      this.y += 83;
    }
  }

  restart() {
    this.x = 202;
    this.y = 388;
  }
}

// Displays player lives.
class Lives {
  constructor(x, y) {
    this.sprite = 'images/Heart.png';
    this.x = x;
    this.y = y;
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 35, 59);
  }
}

// Score display made using https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
class Score {
  render() {
    ctx.font='20px Pangolin';
    ctx.fillStyle = '#fefefe';
    ctx.fillText('Points: ' + points, 408, 573);
  }
}

// Makes end game box visible and displays the amount of points gathered.
function lose() {
  gameEnd.css('display', 'block');
  endParagraph.html(`Being eaten alive by the bugs probably hurt. You gathered ${points} ${points == 1 ? 'point' : 'points'} before that happened.`);
}

// Restarts the game, sets the required variables to their starting values.
function restartGame() {
  player.restart();
  hearts = [new Lives(0, 534), new Lives(33, 534), new Lives(66, 534)];
  life = 3;
  points = 0;
  gameEnd.css('display', 'none');
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Every 750 milliseconds a new Enemy is pushed onto the allEnemies array.
setInterval(function() {
  allEnemies.push(new Enemy());
}, 750);

const allEnemies = [];
const player = new Player();
const score = new Score();
// Sets the heart images in proper places.
let hearts = [new Lives(0, 534), new Lives(33, 534), new Lives(66, 534)];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
