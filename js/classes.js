import {
  getCurrentSybmol,
  changeCurrentSymbol,
  gameWon,
  endGame,
  gameOver,
  gameTied,
} from "./main.js";

class SmallGrid extends PIXI.Graphics {
  constructor(x, y, lineWidth, squareResolution, inactiveColor, app) {
    super();

    this.app = app;

    this.app.stage.addChild(this);

    this.x = x;
    this.y = y;
    this.lineWidth = lineWidth;
    this.squareResolution = squareResolution;
    this.inactiveColor = inactiveColor;
    this.winningSymbol = 0;

    this.sprite;

    this.drawingGrid = [[], [], []];

    this.logicalGrid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }

  setUpGrid() {
    //initialize the cells

    let middleXStartingPos = this.x + this.squareResolution + this.lineWidth;
    let middleYStartingPos = this.y + this.squareResolution + this.lineWidth;

    let rightStartingXPos =
      (this.squareResolution + this.lineWidth) * 2 + this.x;
    let bottomStartingYPos =
      (this.squareResolution + this.lineWidth) * 2 + this.y;

    this.drawingGrid[0].push(
      new Cell(
        this.x,
        this.y,
        this.squareResolution,
        this.inactiveColor,
        this,
        this.app
      )
    );

    this.drawingGrid[0].push(
      new Cell(
        middleXStartingPos,
        this.y,
        this.squareResolution,
        this.inactiveColor,
        this,
        this.app
      )
    );

    this.drawingGrid[0].push(
      new Cell(
        rightStartingXPos,
        this.y,
        this.squareResolution,
        this.inactiveColor,
        this,
        this.app
      )
    );

    this.drawingGrid[1].push(
      new Cell(
        this.x,
        middleYStartingPos,
        this.squareResolution,
        this.inactiveColor,
        this,
        this.app
      )
    );

    this.drawingGrid[1].push(
      new Cell(
        middleXStartingPos,
        middleYStartingPos,
        this.squareResolution,
        this.inactiveColor,
        this,
        this.app
      )
    );

    this.drawingGrid[1].push(
      new Cell(
        rightStartingXPos,
        middleYStartingPos,
        this.squareResolution,
        this.inactiveColor,
        this,
        this.app
      )
    );

    this.drawingGrid[2].push(
      new Cell(
        this.x,
        bottomStartingYPos,
        this.squareResolution,
        this.inactiveColor,
        this,
        this.app
      )
    );

    this.drawingGrid[2].push(
      new Cell(
        middleXStartingPos,
        bottomStartingYPos,
        this.squareResolution,
        this.inactiveColor,
        this,
        this.app
      )
    );

    this.drawingGrid[2].push(
      new Cell(
        rightStartingXPos,
        bottomStartingYPos,
        this.squareResolution,
        this.inactiveColor,
        this,
        this.app
      )
    );

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let cell = this.drawingGrid[i][j];
        cell.draw();

        //have the squares light up red if the mouse hovers over it
        cell.interactive = true;
        cell.buttonMode = true;
        cell.on("mouseover", () => {
          activateCell(cell);
        });
        cell.on("mouseout", () => {
          deactivateCell(cell);
        });

        //when cell is clicked, place piece
        cell.on("click", () => {
          clickPiece(cell, this.app);
        });
      }
    }
  }

  wonBoard() {
    //#region won row

    for (let row = 0; row < 3; row++) {
      let firstPiece = this.logicalGrid[row][0];
      if (
        firstPiece !== 0 &&
        firstPiece === this.logicalGrid[row][1] &&
        firstPiece === this.logicalGrid[row][2]
      ) {
        return firstPiece;
      }
    }
    //#endregion

    //#region won col

    for (let col = 0; col < 3; col++) {
      let firstPiece = this.logicalGrid[0][col];
      if (
        firstPiece !== 0 &&
        firstPiece === this.logicalGrid[1][col] &&
        firstPiece === this.logicalGrid[2][col]
      ) {
        return firstPiece;
      }
    }
    //#endregion

    //#region forward slash
    if (
      this.logicalGrid[0][0] !== 0 &&
      this.logicalGrid[0][0] === this.logicalGrid[1][1] &&
      this.logicalGrid[0][0] === this.logicalGrid[2][2]
    ) {
      return this.logicalGrid[0][0];
    }
    //#endregion

    //#region back slash

    if (
      this.logicalGrid[2][0] !== 0 &&
      this.logicalGrid[2][0] === this.logicalGrid[1][1] &&
      this.logicalGrid[2][0] === this.logicalGrid[0][2]
    ) {
      return this.logicalGrid[2][0];
    }

    //#endregion

    return 0;
  }

  setBigSymbol() {
    let winningSymbol = getCurrentSybmol();

    //set the winning symbol
    this.winningSymbol = winningSymbol;

    //get rid of the small sprites
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.app.stage.removeChild(this.drawingGrid[i][j].currentSprite);
        this.drawingGrid[i][j].currentSprite = null;
      }
    }

    //add big sprite
    if (winningSymbol === 1) {
      this.sprite = new PIXI.Sprite.from("./images/GreenBigO.png");
    } else {
      this.sprite = new PIXI.Sprite.from("./images/BlueBigX.png");
    }

    this.sprite.x = this.x;
    this.sprite.y = this.y;

    this.app.stage.addChild(this.sprite);

    //make all of the cells inside the grid uninteractable
  }

  boardFilled() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.logicalGrid[i][j] === 0) {
          return false;
        }
      }
    }
    return true;
  }

  clearBoard() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.logicalGrid[i][j] = 0;
        this.app.stage.removeChild(this.drawingGrid[i][j].currentSprite);
        this.drawingGrid[i][j].currentSprite = null;
      }
    }
  }

  setWinningSymbol(piece) {
    this.winningSymbol = piece;
  }

  updateGrid(cell) {
    let row = -1;
    let col = -1;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (cell === this.drawingGrid[i][j]) {
          row = i;
          col = j;
          break;
        }
      }
    }

    this.logicalGrid[row][col] = getCurrentSybmol();
  }
}

class Cell extends PIXI.Graphics {
  constructor(x, y, resolution, inactiveColor, grid, app) {
    super();

    this.app = app;

    this.app.stage.addChild(this);

    this.symbol = 0;

    this.x = x;
    this.y = y;
    this.grid = grid;
    this.resolution = resolution;
    this.activeCell = false;
    this.inactiveColor = inactiveColor;
    this.currentColor = inactiveColor;
    this.currentSprite = null;
    this.prompSprite = null;
  }

  draw() {
    if (this.activeCell) {
      let symbol = getCurrentSybmol();

      this.prompSprite =
        symbol == 1
          ? new PIXI.Sprite.from("./images/RedO.png")
          : new PIXI.Sprite.from("./images/RedX.png");

      this.prompSprite.x = this.x;
      this.prompSprite.y = this.y;

      this.app.stage.addChild(this.prompSprite);

      // this.beginFill(this.activeColor);
    } else {
      this.app.stage.removeChild(this.prompSprite);
      this.beginFill(this.inactiveColor);
    }
    this.drawRect(0, 0, this.resolution, this.resolution);

    this.endFill();
  }
}

function activateCell(cell) {
  if (!cell.currentSprite && cell.grid.winningSymbol == 0 && !gameOver) {
    cell.activeCell = true;
    cell.draw();
  }
}

function deactivateCell(cell) {
  cell.activeCell = false;
  cell.draw();
}

function clickPiece(cell, app) {
  //if the game is over, don't apply do anything
  if (gameOver) {
    return;
  }

  //if the board is already won, then don't do anything
  if (cell.grid.winningSymbol !== 0) {
    return;
  }

  let sprite = cell.currentSprite;
  //if this cell already have a sprite, don't do anything
  if (sprite) {
    return;
  }

  //remove the prompt sprite
  app.stage.removeChild(cell.prompSprite);

  //put the correcnt sprite on the cell
  let symbol = getCurrentSybmol();

  if (symbol === 1) {
    sprite = new PIXI.Sprite.from("./images/GreenO.png");
  } else {
    sprite = new PIXI.Sprite.from("./images/BlueX.png");
  }

  sprite.x = cell.x;
  sprite.y = cell.y;

  cell.currentSprite = sprite;

  app.stage.addChild(sprite);

  //make the background inactive color
  cell.activeCell = false;
  cell.draw();

  //update the logic for the grid
  cell.grid.updateGrid(cell);

  //check to see if the board has been won, if so, set the big symbol

  let symbolWon = cell.grid.wonBoard();

  if (symbolWon !== 0) {
    cell.grid.setBigSymbol();
  }

  //if the board isn't won, check if there has been a tie and clear board
  else if (cell.grid.boardFilled()) {
    cell.grid.clearBoard();
  }

  //check to see if the game has been won
  if (gameWon() !== 0) {
    endGame(getCurrentSybmol());
    return;
  }

  //check to see if the game has been tied
  if (gameTied()) {
    endGame(0);
    return;
  }

  //if game isn't over, change the symbol for the next piece
  changeCurrentSymbol();
}

export { SmallGrid };
