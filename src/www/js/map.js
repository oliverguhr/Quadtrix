class Map {
    constructor(w, h, you, opponent) {
    this.height = h;
    this.width = w;
    this.coins = [];
    this.coinCount = 0;
    this.players = { you: you, opponent: opponent }
    this.coinsToSolve = 3;
    this.winCondiditon = 100;
    }

    getCoins() { return this.coins; }
    getPlayers() { return this.players; }

    // not needed yet.
    getCoinByID(id)
    {
      //var coin = [];
      return coin = this.coins.filter(function(coin) {
        return coin.id === id;
      })
      // return coin;
    }

    // required for neighbor detection.
    getCoinByXY(x, y)
    {
      return this.coins.filter(function(coinsXY) {
        return coinsXY.targetX === x && coinsXY.targetY === y;
      })
    }

    applyCoin(coin) { // 6 und 2
      // coin id to find coin in array
     // TODO: [x]  Line is FUll Block
     // TODO: [x] Block Interaction during Animation // fieldLock gets called to early :/
     // TODO: [ ] Block Interaction during enemy player Turn

     //did the user user click on the arrows?
      if (!((coin.x == 0 && coin.y == 0) ||
          (coin.x == 0 && coin.y == this.height) ||
          (coin.x == this.width && coin.y == 0) ||
          (coin.x == this.width && coin.y == this.height))
      ) {
        if (coin.x == 0) {
            coin.direction = 'east';
            coin.x = 0; coin.targetX = 0;
            // only push if there is space forit
            if(this.getLineCoins(coin.y, coin.direction).length != this.width - 1) {
              this.coins.push(coin);
            } else {
              return false;
            }
        }
        if (coin.y == 0) {
            coin.direction = 'south';
            coin.y = 0; coin.targetY = 0;
            if(this.getLineCoins(coin.x, coin.direction).length != this.height - 1) {
              this.coins.push(coin);
            } else {
              return false;
            }
        }
        if (coin.x == this.width) {
           coin.direction = 'west';
           coin.x = this.width; coin.targetX = this.width;
           if(this.getLineCoins(coin.y, coin.direction).length != this.width - 1) {
             this.coins.push(coin);
           } else {
             return false;
           }
        }
        if (coin.y == this.height) {
          coin.direction = 'north';
          coin.y = this.height; coin.targetY =  this.height;
          if(this.getLineCoins(coin.x, coin.direction).length != this.height - 1) {
            this.coins.push(coin);
          } else {
            return false;
          }
        }
        return true;
      }
      return false;
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
      this.isMoveable(coinsInLine, direction);

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
      while(this.hasMoveableCoins(coinsInLine)) {
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
      }
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

  // Input "row" to check row lines otherwise it will check column lines
  checkForTermination(checkRowOrColumn) {
    for (var i = 1; i < this.width; i++) {
      var lastOwner = "";
      var currentOwner = "";
      var count = 0;
      var coinsToRemove = [];
      var coin;
      for (var j = 1; j < this.height; j++) {
        // get coin on Position
        if (checkRowOrColumn == "rows") {
          coin = this.getCoinByXY(i, j)[0];
        } else { // check Columns.
          coin = this.getCoinByXY(j, i)[0];
        }

        // if no coin exists
        if (coin == undefined) {
          if (count >= this.coinsToSolve) {
            count++;
            this.removeCoins(coinsToRemove);
            this.addScroreToPlayer(lastOwner, count);
          }
          coinsToRemove = []; count = 0;
        } else if (coin.owner != lastOwner && count >= this.coinsToSolve) {
          count++;
            this.removeCoins(coinsToRemove);
            this.addScroreToPlayer(lastOwner, count);
            coinsToRemove = []; count = 0;
        } else if (coin.owner == lastOwner || count == 0) {
            count++;
            lastOwner = coin.owner;
            coinsToRemove.push(coin);
            if ((j == this.height - 1 && coinsToRemove.length >= this.coinsToSolve)) {
              count++;
              this.removeCoins(coinsToRemove);
              this.addScroreToPlayer(lastOwner, count);
              coinsToRemove = []; count = 0;
            }
        } else if (coin.owner != lastOwner) {
          coinsToRemove = []; count = 1;
          coinsToRemove.push(coin);
          lastOwner = coin.owner;
       }
      }
    }
  }

  addScroreToPlayer(playerColor, score) {
    if (playerColor == this.players.you.color) {
      this.players.you.score += (score-1)*2;
    } else {
      this.players.opponent.score += (score-1)*2;
    }
  }

  checkWinConditionForPlayer() {
    if (this.players.you.score >= this.winCondiditon) {
      return this.players.you.name;
    } else if (this.players.opponent.score >= this.winCondiditon) {
      return this.players.opponent.name;
    }
    return undefined;
  }

  // remove coins from map object.
  removeCoins(coinsToRemove, timeout) {

    for (var i = 0; i < coinsToRemove.length; i++) {
      // get index from coin array
      var index = this.coins.findIndex(function(element) {
        return element.id === coinsToRemove[i].id;
      });
      // remove Animation
      terminateCoin(this.coins[index]);
    }

    setTimeout(function (coins, coinsToRemove) {
      for (var i = 0; i < coinsToRemove.length; i++) {
        // get index from coin array
        var index = coins.findIndex(function(element) {
          return element.id === coinsToRemove[i].id;
        });
        // remove Animation
        coins.splice(index, 1);
      }
    }, 1000, this.coins, coinsToRemove);

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

    //check for termination
    // this.checkAllRowsForTermination();
    // undlock gamefield and force Readraw // Triggers to early
    unlockField();
	}
}
