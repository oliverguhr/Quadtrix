class Map {
    constructor(w, h, players) {
    this.height = h;
    this.width = w;
    this.coins = [];
    this.coinCount = 0;
    this.players = players;
    }

    getCoins() { return this.coins; }
    getPlayers() { return this.players; }

    // not needed yet.
    getCoinByID(id)
    {
      var coin = [];
      coin = this.coins.filter(function(coin) {
        return coin.id === id;
      })
      return coin;
    }

    // required for neighbor detection.
    getCoinByXY(x, y)
    {
      var coinsXY = [];
      coinsXY = this.coins.filter(function(coinsXY) {
        return coinsXY.targetX === x && coinsXY.targetY === y;
      })
      return coinsXY;
    }

    applyCoin(coin) { // 6 und 2
      // coin id to find coin in array
     // TODO: Line is FUll Block
     // TODO: Block Interaction during Animation
     // TODO: Block Interaction during enemy player Turn
     if (this.coins.length % 2 == 0) { coin.color = 'blue' }


      if (!((coin.x == 0 && coin.y == 0) ||
          (coin.x == 0 && coin.y == this.height) ||
          (coin.x == this.width && coin.y == 0) ||
          (coin.x == this.width && coin.y == this.height))
      ) {
        if (coin.x == 0) {
            coin.direction = 'east';
            coin.x = 1; coin.targetX = 1;
            this.coins.push(coin);
        }
        if (coin.y == 0) {
            coin.direction = 'south';
            coin.y = 1; coin.targetY = 1;
            this.coins.push(coin);
        }
        if (coin.x == this.width) {
           coin.direction = 'west';
           coin.x = this.width - 1; coin.targetX = this.width - 1;
           this.coins.push(coin);
        }
        if (coin.y == this.height) {
          coin.direction = 'north';
          coin.y = this.height - 1; coin.targetY =  this.height - 1;
          this.coins.push(coin);
        }
      }
    }

    // returns all coins in line
    getLineCoins(line, direction) {
        var coinsInLine = [];
        for (var i = 0; i < this.coins.length; i++) {
          if (direction == 'west' || direction == 'east') {
            if (this.coins[i].y == line) {
              coinsInLine.push(this.coins[i]);
            }
          } else {
            if (this.coins[i].x == line) {
              coinsInLine.push(this.coins[i]);
            }
          }
        }
        return coinsInLine;
    }

    moveLine(coinsInLine, direction, doneFn) {
      // if there are moveable coins within that line move them towards
      // target direction until no moveable element is left.
       while(this.isMoveable(coinsInLine, direction)) { /* */ }

      for (var i = 0; i < this.coins.length; i++) {
        // calc destination
        var dist = 0;
        if(this.coins[i].x != this.coins[i].targetX) {
          dist = this.coins[i].targetX - this.coins[i].x;
        } else if (this.coins[i].y != this.coins[i].targetY) {
          dist = this.coins[i].targetY - this.coins[i].y
        }

        AnimateCircle(this.coins[i], Math.abs(dist), doneFn);
      }
    }


    isMoveable(coinsInLine, direction) {
      for (var i = 0; i < coinsInLine.length; i++) {
        // set coin direction, not sure if we need to set it
        // or if we need the original direction later on...
        // both is posible.
        coinsInLine[i].direction = direction;

        // detect movement and set new targetXY if possible
        switch(coinsInLine[i].direction) {
          case "east":
              // for 2 or more elements check if the element blocked by another coin or hit the wall
              if (this.getCoinByXY(coinsInLine[i].targetX + 1, coinsInLine[i].targetY).length > 0
                  || coinsInLine[i].targetX == this.width - 1) {
                 coinsInLine[i].isMoveable = false;
              } else {
                 coinsInLine[i].targetX = coinsInLine[i].targetX + 1;
                 coinsInLine[i].isMoveable = true;
              }
              break;
          case "west":
              if (this.getCoinByXY(coinsInLine[i].targetX - 1, coinsInLine[i].targetY).length > 0
                  || coinsInLine[i].targetX == 1) {
                 coinsInLine[i].isMoveable = false;
              } else {
                 coinsInLine[i].targetX = coinsInLine[i].targetX - 1;
                 coinsInLine[i].isMoveable = true;
              }
              break;
          case "north":
              if (this.getCoinByXY(coinsInLine[i].targetX, coinsInLine[i].targetY - 1).length > 0
                  || coinsInLine[i].targetY == 1) {
                 coinsInLine[i].isMoveable = false;
              } else {
                 coinsInLine[i].targetY = coinsInLine[i].targetY - 1;
                 coinsInLine[i].isMoveable = true;
              }
              break;
          case "south":
              if (this.getCoinByXY(coinsInLine[i].targetX, coinsInLine[i].targetY + 1).length > 0
                  || coinsInLine[i].targetY == this.height - 1) {
                 coinsInLine[i].isMoveable = false;
              } else {
                 coinsInLine[i].targetY = coinsInLine[i].targetY + 1;
                 coinsInLine[i].isMoveable = true;
              }
              break;
          default:
             console.log('No Valid Coin.');
        }
      }
      // return True if there are moveable coins left.
       return this.hasMoveableCoins(coinsInLine);
    }

    // surely redundant but needed at the moment.
    hasMoveableCoins(coinsInLine){
      var hasMoveables = false;
      for (var i = 0; i < coinsInLine.length; i++) {
        if(coinsInLine[i].isMoveable == true) {
          hasMoveables = true;
          break;
        };
      }
      return hasMoveables;
    }

    checkAllRowsForTermination() {
        // TODO: Prove Lines
        // TODO: Prove Diagonal
    }

  // start the coin animation --- called from GameController on ngRepeatFinishedEvent
	animate(unlockField, doneFn){
    // get last inserted coin
    var lastCoin = this.coins[this.coins.length -1];
    var line;

    // get movement
    switch(lastCoin.direction) {
      case "east":
         line = lastCoin.y;
         break;
      case "west":
         line = lastCoin.y;
         break;
      case "north":
         line = lastCoin.x;
         break;
      case "south":
         line = lastCoin.x;
         break;
      default:
         console.log('No Valid Coin.');
    }

    // Move Coins in Line
    var line = this.getLineCoins(line, lastCoin.direction);
    this.moveLine(line, lastCoin.direction, doneFn);

    // undlock gamefield and force Readraw
    unlockField();
	}
}
