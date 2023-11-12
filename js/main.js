/* X = -1, O = 1 */
import { SmallGrid } from "./classes.js";

("use strict");

const gameresolution = 600;
const offset = 100;
const resoultion = gameresolution + offset;
const app = new PIXI.Application({
  width: resoultion - offset,
  height: resoultion,
});
document.body.appendChild(app.view);

//used to draw graphics and sprites
const graphics = new PIXI.Graphics();

//game
let gameOver;
let grid;
let drawingGrid;
let currnetTurnText;
let currentSymbol;
const textOffset = 50;
let textStyle;
let oStyle;
let xStyle;
let resetButton;
let xWinsNum = 0;
let oWinsNum = 0;
let xWinsText;
let oWinsText;
let endGameSound;
let winSoundArr = ["./sound/win1.wav", "./sound/win2.wav", "./sound/win3.wav", "./sound/win4.wav", "./sound/win5.wav"];

app.loader.onComplete.add(setUpGame);
app.loader.load();

function resetGame() {
  console.log("reset game");
  //change the symbol text back to orignal position
  currnetTurnText.x = currnetTurnText.x - textOffset;

  //get rid of all the big symbols on board
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      app.stage.removeChild(grid[i][j].sprite);
    }
  }

  //get rid of all of the small symbols on the board
  //get rid of all the cells on the board
  for (let bigRow = 0; bigRow < 3; bigRow++) {
    for (let bigCol = 0; bigCol < 3; bigCol++) {
      for (let cellRow = 0; cellRow < 3; cellRow++) {
        for (let cellCol = 0; cellCol < 3; cellCol++) {
          app.stage.removeChild(
            grid[bigRow][bigCol].drawingGrid[cellRow][cellCol].currentSprite
          );
          app.stage.removeChild(
            grid[bigRow][bigCol].drawingGrid[cellRow][cellCol]
          );
        }
      }
    }

    //get rid of the text at the top
    app.stage.removeChild(currnetTurnText);

    //get rid of the resetButton
    app.stage.removeChild(resetButton);
  }

  //remove the smallGrids from grid
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      app.stage.removeChild(drawingGrid[row][col]);
    }
  }

  //get rid of the score text
  app.stage.removeChild(xWinsText);
  app.stage.removeChild(oWinsText);

  setUpGame();
}

/*Initializes the board graphics*/
function setUpGame() {
  gameOver = false;

  grid = [[], [], []];

  let lineWidth = 12;
  let bigSquareResolution = (gameresolution - lineWidth * 2) / 3;

  //draws big board
  drawSquares(
    0,
    offset,
    lineWidth,
    bigSquareResolution,
    0x74918a,
    graphics,
    app
  );

  //set the style
  textStyle = new PIXI.TextStyle({
    fill: 0xffffff,
    fontSize: 24,
    fontFamily: "Arial",
  });

  oStyle = new PIXI.TextStyle({
    fill: 0x00ff00,
    fontSize: 24,
    fontFamily: "Arial",
  });

  xStyle = new PIXI.TextStyle({
    fill: 0x0000ff,
    fontSize: 24,
    fontFamily: "Arial",
  });

  //create play again button
  resetButton = new PIXI.Text("Play Again");
  resetButton.style = textStyle;
  resetButton.interactive = true;
  resetButton.buttonMode = true;
  resetButton.on("pointerup", resetGame);
  resetButton.on("pointerover", (e) => (e.target.alpha = 0.7));
  resetButton.on("pointerout", (e) => (e.currentTarget.alpha = 1.0));
  resetButton.x = resoultion / 2 - 106;
  resetButton.y = 50;
  resetButton.visible = false;

  app.stage.addChild(resetButton);

  //create x wins text
  xWinsText = new PIXI.Text("X wins: " + xWinsNum);
  xWinsText.style = textStyle;
  xWinsText.y = 10;
  xWinsText.x = 20;

  app.stage.addChild(xWinsText);
  //create o wins text
  oWinsText = new PIXI.Text("O wins: " + oWinsNum);
  oWinsText.style = textStyle;
  oWinsText.y = 10;
  oWinsText.x = gameresolution - 125;
  app.stage.addChild(oWinsText);

  //Randomly say who goes first

  currentSymbol = Math.floor(Math.random() * 2) == 1 ? 1 : -1;

  currnetTurnText = new PIXI.Text();
  changeCurrentText();

  currnetTurnText.x = resoultion / 2 - 136;
  currnetTurnText.y = 10;
  app.stage.addChild(currnetTurnText);

  //#region draw little boards

  let littleLineWidth = 3;

  let littleSquareResolution = (bigSquareResolution - littleLineWidth * 2) / 3;

  let middle = bigSquareResolution + lineWidth;
  let right = middle * 2;

  grid[0].push(
    new SmallGrid(
      0,
      offset,
      littleLineWidth,
      littleSquareResolution,
      0x76d1ed,
      app
    )
  );

  grid[0].push(
    new SmallGrid(
      middle,
      offset,
      littleLineWidth,
      littleSquareResolution,
      0x76d1ed,
      app
    )
  );

  grid[0].push(
    new SmallGrid(
      right,
      offset,
      littleLineWidth,
      littleSquareResolution,
      0x76d1ed,
      app
    )
  );

  grid[1].push(
    new SmallGrid(
      0,
      middle + offset,
      littleLineWidth,
      littleSquareResolution,
      0x76d1ed,
      app
    )
  );

  grid[1].push(
    new SmallGrid(
      middle,
      middle + offset,
      littleLineWidth,
      littleSquareResolution,
      0x76d1ed,
      app
    )
  );

  grid[1].push(
    new SmallGrid(
      right,
      middle + offset,
      littleLineWidth,
      littleSquareResolution,
      0x76d1ed,
      app
    )
  );

  grid[2].push(
    new SmallGrid(
      0,
      right + offset,
      littleLineWidth,
      littleSquareResolution,
      0x76d1ed,
      app
    )
  );

  grid[2].push(
    new SmallGrid(
      middle,
      right + offset,
      littleLineWidth,
      littleSquareResolution,
      0x76d1ed,
      app
    )
  );

  grid[2].push(
    new SmallGrid(
      right,
      right + offset,
      littleLineWidth,
      littleSquareResolution,
      0x76d1ed,
      app
    )
  );

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i][j]) grid[i][j].setUpGrid();
    }
  }

  //#endregion
}

function getCurrentSybmol() {
  return currentSymbol;
}

function changeCurrentSymbol() {
  currentSymbol = currentSymbol == 1 ? -1 : 1;
  changeCurrentText();
}

function changeCurrentText() {
  if (currentSymbol === 1) {
    currnetTurnText.text = "Current Turn: O";
    currnetTurnText.style = oStyle;
  } else {
    currnetTurnText.text = "Current Turn: X";
    currnetTurnText.style = xStyle;
  }
}

function gameWon() {
  //#region won row

  for (let row = 0; row < 3; row++) {
    let firstPiece = grid[row][0].winningSymbol;
    if (
      firstPiece !== 0 &&
      firstPiece === grid[row][1].winningSymbol &&
      firstPiece === grid[row][2].winningSymbol
    ) {
      return firstPiece;
    }
  }
  //#endregion

  //#region won col

  for (let col = 0; col < 3; col++) {
    let firstPiece = grid[0][col].winningSymbol;
    if (
      firstPiece !== 0 &&
      firstPiece === grid[1][col].winningSymbol &&
      firstPiece === grid[2][col].winningSymbol
    ) {
      return firstPiece;
    }
  }
  //#endregion

  //#region forward slash
  if (
    grid[0][0].winningSymbol !== 0 &&
    grid[0][0].winningSymbol === grid[1][1].winningSymbol &&
    grid[0][0].winningSymbol === grid[2][2].winningSymbol
  ) {
    return grid[0][0].winningSymbol;
  }
  //#endregion

  //#region back slash

  if (
    grid[2][0].winningSymbol !== 0 &&
    grid[2][0].winningSymbol === grid[1][1].winningSymbol &&
    grid[2][0].winningSymbol === grid[0][2].winningSymbol
  ) {
    return grid[2][0].winningSymbol;
  }

  //#endregion

  return 0;
}

function gameTied() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i][j].winningSymbol === 0) {
        return false;
      }
    }
  }
  return true;
}

function endGame(symbol) {
  resetButton.visible = true;
  gameOver = true;

  if (symbol == 1 || symbol == -1) {
    endGameSound = new Howl({
      src: [winSoundArr[Math.floor(Math.random() * winSoundArr.length)]],
    });

    if (symbol == 1) {
      currnetTurnText.text = "O wins!";
      currnetTurnText.style = oStyle;
    } else {
      currnetTurnText.text = "X wins!";
      currnetTurnText.style = xStyle;
    }
  } else {
    currnetTurnText.text = "Tie!";
    currnetTurnText.style = textStyle;
    //add sound effect for tie
    endGameSound = new Howl({
      src: ["./sound/tie.mp3"],
    });
  }

  //play sound affect
  endGameSound.play();

  currnetTurnText.x = currnetTurnText.x + textOffset;

  //add score for winning player

  if (symbol === 1) {
    oWinsNum++;
  } else if (symbol === -1) {
    xWinsNum++;
  }

  oWinsText.text = "O wins: " + oWinsNum;
  xWinsText.text = "X wins: " + xWinsNum;

}

//x: starting x position of the grid
//y: starting y position of the grid
//resolution: the resolution of the grid
function drawSquares(x, y, lineWidth, squareResolution, color, graphics, app) {
  drawingGrid = [[], [], []];
  graphics.beginFill(color);

  let middleXStartingPos = x + squareResolution + lineWidth;
  let middleYStartingPos = y + squareResolution + lineWidth;

  let rightStartingXPos = (squareResolution + lineWidth) * 2 + x;
  let rightStartingYPos = (squareResolution + lineWidth) * 2 + y;

  let topLeft = graphics.drawRect(x, y, squareResolution, squareResolution);

  let topMiddle = graphics.drawRect(
    middleXStartingPos,
    y,
    squareResolution,
    squareResolution
  );

  let topRight = graphics.drawRect(
    rightStartingXPos,
    y,
    squareResolution,
    squareResolution
  );

  let middleLeft = graphics.drawRect(
    x,
    middleYStartingPos,
    squareResolution,
    squareResolution
  );

  let center = graphics.drawRect(
    middleXStartingPos,
    middleYStartingPos,
    squareResolution,
    squareResolution
  );

  let middleRight = graphics.drawRect(
    rightStartingXPos,
    middleYStartingPos,
    squareResolution,
    squareResolution
  );

  let bottomLeft = graphics.drawRect(
    x,
    rightStartingYPos,
    squareResolution,
    squareResolution
  );

  let bottomMiddle = graphics.drawRect(
    middleXStartingPos,
    rightStartingYPos,
    squareResolution,
    squareResolution
  );

  let bottomRight = graphics.drawRect(
    rightStartingXPos,
    rightStartingYPos,
    squareResolution,
    squareResolution
  );

  graphics.endFill();

  app.stage.addChild(topLeft);
  app.stage.addChild(topMiddle);
  app.stage.addChild(topRight);

  drawingGrid[0].push(topLeft);
  drawingGrid[0].push(topMiddle);
  drawingGrid[0].push(topRight);

  app.stage.addChild(middleLeft);
  app.stage.addChild(center);
  app.stage.addChild(middleRight);

  drawingGrid[1].push(middleLeft);
  drawingGrid[1].push(center);
  drawingGrid[1].push(middleRight);

  app.stage.addChild(bottomLeft);
  app.stage.addChild(bottomMiddle);
  app.stage.addChild(bottomRight);

  drawingGrid[2].push(bottomLeft);
  drawingGrid[2].push(bottomMiddle);
  drawingGrid[2].push(bottomRight);
}

export {
  getCurrentSybmol,
  changeCurrentSymbol,
  gameWon,
  endGame,
  gameOver,
  gameTied,
};
