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
    var KeyCode_SHOOT_1 = 32; //space
    var KeyCode_SHOOT_2 = 13; //enter
    var KeyCode_LEFT_2 = 65; //a
    var KeyCode_UP_2 = 87; //w
    var KeyCode_RIGHT_2 = 68; //d
    var KeyCode_DOWN_2 = 83; //s
    var KeyCode_CTRL = 17;
    var KeyCode_Z = 90;
    var KeyCode_G = 71;
    var STEP = 5; //px per 1 step of moving
    //direction of tank moving
    var LEFT = 0;
    var UP = 1;
    var RIGHT = 2;
    var DOWN = 3;
    //last tank direction (for bullet)
    var lastMoveTank1 = 0;
    var lastMoveTank2 = 0;

    var player1Tank = $('.tank[data-player="1"]');
    var player2Tank = $('.tank[data-player="2"]');

    var margins = {
      left: 0,
      right: $('.border').width() - $('.tank').width(),
      top: 15, //magic
      bottom: $('.game-arena').height() - $('.tank').height() - parseInt($('.game-arena').css('border-width'))
    }

    //tank moving
    //rotate tank left
    function moveLeft(tank) {
      var tankPosition = (parseInt(tank.css("left")) - 5);;
      if (tankPosition <= margins.left) {
        tankPosition = tank.css("left");
      }
      tank.css({
        'left': tankPosition,
        'transform': 'rotate(180deg)'
      });
    }

    //rotate tank right
    function moveRight(tank) {
      var tankPosition = (parseInt(tank.css("left")) + 5);
      if (tankPosition > margins.right) {
        tankPosition = tank.css("left");
      }
      tank.css({
        'left': tankPosition,
        'transform': 'rotate(0deg)'
      });
    }

    //rotate tank up
    function moveUp(tank) {
      var tankPosition = (parseInt(tank.css("top")) - 5);
      if (tankPosition < margins.top) {
        tankPosition = tank.css("top");
      }
      tank.css({
        'transform': 'rotate(-90deg)',
        'top': tankPosition
      });
    }

    //rotate tank down
    function moveDown(tank) {
      var tankPosition = (parseInt(tank.css("top")) + 5);
      if (tankPosition > margins.bottom) {
        tankPosition = tank.css("top");
      }
      tank.css({
        'transform': 'rotate(90deg)',
        'top': tankPosition
      });
    }

    function shoot(tank) {
      var user = tank.attr("data-player");
      var lastDirection; //of moving tank
      if (user == 1) {
        lastDirection = lastMoveTank1;
      } else {
        lastDirection = lastMoveTank2;
      }
      var bullet = $('<div class="tank-shoot-bullet" />');

      //rotate bullet
      switch (lastDirection) {
        case 0: //left
          bullet.css({
            "transform": 'rotate(180deg)',
            "left": parseInt(tank.css("left")) - 75,
            "top": parseInt(tank.css("top")) + 22
          });
          break;
        case 1: //up
          bullet.css({
            "transform": 'rotate(-90deg)',
            "left": parseInt(tank.css("left")) + 12,
            "top": parseInt(tank.css("top")) - 60
          });
          break;
        case 2: //right
          bullet.css({
            "transform": 'rotate(00deg)',
            "left": parseInt(tank.css("left")) + 95,
            "top": parseInt(tank.css("top")) + 25
          });
          break;
        case 3: //down
          bullet.css({
            "transform": 'rotate(90deg)',
            "left": parseInt(tank.css("left")) + 10,
            "top": parseInt(tank.css("top")) + 108
          });
          break;
      }
      $(".border").append(bullet); //add bullet to field
      var timer = setInterval(function () {
        var opponent;
        var opponentDirection;
        changeBulletPosition(lastDirection, bullet, timer);
        if (user == 1) {
          opponent = $(".tank[data-player=2]");
          opponentDirection = lastMoveTank2;
        } else {
          opponent = $(".tank[data-player=1]");
          opponentDirection = lastMoveTank1;
        }
        if (matchTank(opponent, bullet, opponentDirection)) {
          bullet.remove();
          //select other player tank
          deatsh(opponent); //burn
          $('.rate[data-player=' + user + ']').text(+$('.rate[data-player=' + user + ']').text() + 1);
          clearInterval(timer);
        }
      }, 10);
    }

    document.body.onkeydown = function (e) {
      var el = document.getElementById('tank');

      switch (e.keyCode) {
        case KeyCode_LEFT_1:
          lastMoveTank1 = 0;
          moveLeft(player1Tank);
          break;
        case KeyCode_RIGHT_1:
          lastMoveTank1 = 2;
          moveRight(player1Tank);
          break;
        case KeyCode_UP_1:
          lastMoveTank1 = 1;
          moveUp(player1Tank);
          break;
        case KeyCode_DOWN_1:
          lastMoveTank1 = 3;
          moveDown(player1Tank);
          break;
        case KeyCode_LEFT_2:
          lastMoveTank2 = 0;
          moveLeft(player2Tank);
          break;
        case KeyCode_RIGHT_2:
          lastMoveTank2 = 2;
          moveRight(player2Tank);
          break;
        case KeyCode_UP_2:
          lastMoveTank2 = 1;
          moveUp(player2Tank);
          break;
        case KeyCode_DOWN_2:
          lastMoveTank2 = 3;
          moveDown(player2Tank);
          break;
        case KeyCode_SHOOT_1:
          shoot(player1Tank);
          break;
        case KeyCode_SHOOT_2:
          shoot(player2Tank);
          break;
      }
    };
  }

  function gameOver() {
    $('.end').removeClass('hide');
    document.body.onkeydown = null;
  }

  function changeBulletPosition(lastDirection, bullet, timer) {
    //change position
    switch (lastDirection) {
      case 0: //left
        bullet.css({
          "left": parseInt(bullet.css("left")) - 20
        });
        break;
      case 1: //up
        bullet.css({
          "top": parseInt(bullet.css("top")) - 20
        });
        break;
      case 2: //right
        bullet.css({
          "left": parseInt(bullet.css("left")) + 20
        });
        break;
      case 3: //down
        bullet.css({
          "top": parseInt(bullet.css("top")) + 20
        });
        break;
    }
    //remove bullet if needed
    var bulletTop = parseInt(bullet.css("top"));
    var bulletLeft = parseInt(bullet.css("left"));
    if (bulletTop < 0 || bulletTop > $(".border").height() ||
      bulletLeft < 0 || bulletLeft > $(".border").width()) {
      bullet.remove();
      clearInterval(timer);
    }
  }

  function matchTank(tank, bullet, lastDirection) {
    //match x
    var bulletOffset = bullet.offset();
    var tankOffset = tank.offset();
    var tankHeight;
    var tankWidth;

    if (lastDirection == 0 || lastDirection == 2) { //left and right
      tankHeight = tank.outerHeight();
      tankWidth = tank.outerWidth();
    } else { // up and down
      tankHeight = tank.outerWidth();
      tankWidth = tank.outerHeight();
    }

    if ((bulletOffset.left < tankOffset.left) || (bulletOffset.left > tankOffset.left + tankWidth)) {
      return false;
    } else if ((bulletOffset.top < tankOffset.top) || (bulletOffset.top > tankOffset.top + tankHeight)) {
      return false;
    }

    return true;
  }

  // function neveTank() {
  //   var neveTanks = $('<div class="tank death" />');
  //   $('.border').append(neveTanks);
  // }

  function deatsh(tank) {
    var fireball = $('<div class="death-of-tank" />');
    tank.append(fireball);
  }

  function TankPosition() {
    //show
    $('.tank').removeClass('hide');
    //first tank
    $('.tank[data-player="1"').css({
      'top': '15px',
      'left': '0px'
    });
    //second
    $('.tank[data-player="2"').css({
      'top': '85%',
      'left': '92%',
      'transform': 'rotate(180deg)'
    });
  }
});