"use strict";

const elGameLayout = document.getElementById("game_layout");
const elGameResult = document.getElementById("game_result");
const elResetButton = document.getElementById("reset_button");

const elNextTurn = document.getElementById("next_turn");

const gameMatrix = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

const gameState = {
    nextSymbol: "X",
    isRunning: true,
    cellsFilled: 0
};

function gameOver() {
    elGameLayout.classList.add("hidden");
    elNextTurn.innerHTML = "";
    gameState.isRunning = false;
}

function checkGameLayout(cellRow, cellCol) {
    const sequences = {
        horizontal: 0,
        vertical: 0,
        leftDiag: 0,
        rightDiag: 0
    };

    const cellSymbol = gameMatrix[cellRow][cellCol];

    for (let index = 0; index < 3; index++) {
        if (gameMatrix[index][cellCol] === cellSymbol) {
            sequences.vertical++;
        }

        if (gameMatrix[cellRow][index] === cellSymbol) {
            sequences.horizontal++;
        }

        if (cellRow === cellCol || Math.abs(cellRow - cellCol) === 2) {
            /* Checking diagonal cells. */
            if (gameMatrix[2 - index][index] === cellSymbol) {
                sequences.rightDiag++;
            }

            if (gameMatrix[index][index] === cellSymbol) {
                sequences.leftDiag++;
            }
        }
    }

    if (
        sequences.horizontal === 3 ||
        sequences.vertical === 3 ||
        sequences.leftDiag === 3 ||
        sequences.rightDiag === 3
    ) {
        /*
        if (cellSymbol === "X") {
            elGameResult.innerHTML = "Player 1 Wins!";
        } else {
            elGameResult.innerHTML = "Player 2 Wins!";
        } 
        */

        elGameResult.innerHTML = cellSymbol === "X" ? "Player 1 Wins!" : "Player 2 Wins!";
        gameOver();
    } else if (gameState.cellsFilled === 9) {
        elGameResult.innerHTML = "It's a DRAW!";
        gameOver();
    }
}

function gameLayoutClickCb(event) {
    const li = event.target;

    if (gameState.isRunning === false || li.nodeName !== "LI" || li.innerHTML !== "") {
        return false;
    }

    const cellRow = parseInt(li.dataset.row);
    const cellCol = parseInt(li.dataset.col);

    gameMatrix[cellRow][cellCol] = gameState.nextSymbol;
    li.innerHTML = gameState.nextSymbol;

    gameState.cellsFilled++;

    if (gameState.nextSymbol === "X") {
        li.classList.add("text-danger");
        elNextTurn.innerHTML = "Player 2";

        gameState.nextSymbol = "O";
    } else {
        li.classList.add("text-white");
        elNextTurn.innerHTML = "Player 1";

        gameState.nextSymbol = "X";
    }

    checkGameLayout(cellRow, cellCol);
}

function resetGameBoard() {
    /* Reset the game state. */
    gameState.nextSymbol = "X";
    gameState.isRunning = true;
    gameState.cellsFilled = 0;

    /* Reset game result DIV and player name DIV. */
    elGameResult.innerHTML = "";
    elNextTurn.innerHTML = "Player 1";

    /* Display the game board back, if it is hidden. */
    elGameLayout.classList.remove("hidden");

    /* Clear every cell in the game board. */
    const elChildren = elGameLayout.children;

    for (let child of elChildren) {
        child.classList.remove("text-danger", "text-white");
        child.innerHTML = "";
    }

    /* Clear and reset the values in game matrix. */
    for (let row = 0; row < gameMatrix.length; row++) {
        for (let col = 0; col < gameMatrix.length; col++) {
            gameMatrix[row][col] = "";
        }
    }
}

elGameLayout.addEventListener("click", gameLayoutClickCb);
elResetButton.addEventListener("click", resetGameBoard);
