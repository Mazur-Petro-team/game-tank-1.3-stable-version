$(function () {
  //Initialization game control
  init();

  function init() {
    $('.start').on('click', start);
    $('.restart').on('click', restart);
  }

  function start() {
    //Remove greeting window
    $('.greeting').remove();
    startGame()
  }

  function restart() {
    //Hide game over
    $('.end').addClass('hide');
    startGame()
  }

  function startGame() {
    //Game control
    TankPosition();
    keyControls();

    //timer
    setTimer();
  }

  //Time for game
  function setTimer() {
    var gameTime = 3;
    var endTime = new Date;
    endTime.setMinutes(endTime.getMinutes() + gameTime);

    var timer = setInterval(changeTime, 500);

    function changeTime() {
      var current = Date.now();
      var timeOver = parseInt((endTime - current) / 1000); //seconds
      if (timeOver <= 0) {
        clearInterval(timer);
        gameOver();
      }
      var minutes = parseInt(timeOver / 60);
      var seconds = timeOver % 60;
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      $('.timer .timer-minutes').text(minutes);
      $('.timer .timer-seconds').text(seconds);
    }
  }

  function keyControls() {
    var KeyCode_LEFT_1 = 37;
    var KeyCode_UP_1 = 38;
    var KeyCode_RIGHT_1 = 39;
    var KeyCode_DOWN_1 = 40;
    var KeyCode_SHOOT_1 = 13; //enter
    var KeyCode_LEFT_2 = 65; //a
    var KeyCode_UP_2 = 87; //w
    var KeyCode_RIGHT_2 = 68; //d
    var KeyCode_DOWN_2 = 83; //s
    var KeyCode_SHOOT_2 = 32; //space
    var KeyCode_CTRL = 17;
    var KeyCode_Z = 90;
    var KeyCode_G = 71;
    var STEP = 5; //px per 1 step of moving

    var player1Tank = $('.tank[data-player="1"]');
    var player2Tank = $('.tank[data-player="2"]');

    //tank moving
    //rotate tank left
    function moveLeft(tank) {
      var tankPosition = (parseInt(tank.css("left")) - 5) + "px";
      tank.css({
        'left': tankPosition,
        'transform': 'rotate(180deg)'
      });
    }

    //rotate tank right
    function moveRight(tank) {
      var tankPosition = (parseInt(tank.css("left")) + 5) + "px";
      tank.css({
        'left': tankPosition,
        'transform': 'rotate(0deg)'
      });
    }

    //rotate tank up
    function moveUp(tank) {
      var tankPosition = (parseInt(tank.css("top")) - 5) + 'px';
      tank.css({
        'transform': 'rotate(-90deg)',
        'top': tankPosition
      });
    }

    //rotate tank down
    function moveDown(tank) {
      var tankPosition = (parseInt(tank.css("top")) + 5) + 'px';
      tank.css({
        'transform': 'rotate(90deg)',
        'top': tankPosition
      });
    }

    function shoot(tank) {
      var bullet = $('<div class="tank-shoot-bullet" />');
      $(tank).append(bullet);
      setTimeout(function() {
        bullet.remove();
      }, 600)
    }

    document.body.onkeydown = function (e) {
      var el = document.getElementById('tank');

      switch (e.keyCode) {
        case KeyCode_LEFT_1:
          moveLeft(player1Tank);
          break;
        case KeyCode_RIGHT_1:
          moveRight(player1Tank);
          break;
        case KeyCode_UP_1:
          moveUp(player1Tank);
          break;
        case KeyCode_DOWN_1:
          moveDown(player1Tank);
          break;
        case KeyCode_LEFT_2:
          moveLeft(player2Tank);
          break;
        case KeyCode_RIGHT_2:
          moveRight(player2Tank);
          break;
        case KeyCode_UP_2:
          moveUp(player2Tank);
          break;
        case KeyCode_DOWN_2:
          moveDown(player2Tank);
          break;
        case KeyCode_SHOOT_1:
          shoot(player1Tank);
          break;
        case KeyCode_SHOOT_2:
          shoot(player2Tank);
          break;
      }

      // } else if (e.keyCode == KeyCode_CTRL) {
      //   deatsh();
      //   setTimeout(function () {
      //     $('.tank').remove();
      //     $('#tank').remove();
      //     $('<div class="death-of-tank" />').remove();
      //   }, 2000);
      // } else if (e.keyCode == KeyCode_Z) {
      //   neveTank();
      // } else if (e.keyCode == KeyCode_G) {
      //   gameOver();
      // }
    };
  }

  function gameOver() {
    $('.end').removeClass('hide');
  }

  function neveTank() {
    var neveTanks = $('<div class="tank death" />');
    $('.border').append(neveTanks);
  }

  function deatsh() {
    var fireball = $('<div class="death-of-tank" />');
    $('.death').append(fireball);
  }

  function TankPosition() {
    //show
    $('.tank').removeClass('hide');
    //first tank
    $('.tank[data-player="1"').css({
      'top': '0px',
      'left': '100px'
    });
    //second
    $('.tank[data-player="2"').css({
      'top': '390px',
      'left': '980px',
      'transform': 'rotate(180deg)'
    });
  }
});