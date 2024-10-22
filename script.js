let board = document.getElementById("board");
let gameBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];
let gameHistory = [];
let moveIndex = -1;
let playerTurn1 = true;
let gameFinished = false;

let nextButton, prevButton, resetButton;
let winnerAnnouncement;

function createBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        let tictactoeGrid = document.createElement("div");
        tictactoeGrid.classList.add("tictactoeBox");
        let gridId = `box${i}`;
        tictactoeGrid.setAttribute("id", gridId);
        board.appendChild(tictactoeGrid);
        tictactoeGrid.addEventListener("click", () => {
            if (!gameFinished && !tictactoeGrid.textContent) {
                addMove(gridId, i);
            }
        }, { once: true });
    }
}

function addMove(element, boxNumber) {
    let specificGrid = document.getElementById(element);
    if (!specificGrid.textContent) {
        if (playerTurn1) {
            specificGrid.textContent = "X";
            specificGrid.style.color = "blue";
            playerTurn1 = false;
        } else {
            specificGrid.textContent = "O";
            specificGrid.style.color = "red";
            playerTurn1 = true;
        }
        updateBoard(specificGrid, boxNumber);
    }
}

function updateBoard(element, boxNumber) {
    let row = Math.floor(boxNumber / 3);
    let column = boxNumber % 3;
    gameBoard[row][column] = element.innerText;
    gameHistory.push(JSON.parse(JSON.stringify(gameBoard)));
    moveIndex = gameHistory.length - 1;
    checkWinner();
}

function checkWinner() {
    const winCombinations = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    for (let combo of winCombinations) {
        const [a, b, c] = combo;
        if (gameBoard[a[0]][a[1]] && gameBoard[a[0]][a[1]] === gameBoard[b[0]][b[1]] && gameBoard[a[0]][a[1]] === gameBoard[c[0]][c[1]]) {
            let winner = gameBoard[a[0]][a[1]];
            enlargeWinningCombo(combo);
            alert(`${winner} wins!`);
            confettiEffect();
            gameFinished = true;
            showHistoryButtons();
            announceWinner(`${winner} wins!`);
            return;
        }
    }

    if (gameBoard.flat().every(cell => cell !== '')) {
        alert("It's a draw!");
        gameFinished = true;
        showHistoryButtons();
        announceWinner("It's a draw!");
    }
}

function enlargeWinningCombo(combo) {
    combo.forEach(([row, col]) => {
        let boxNumber = row * 3 + col;
        let boxElement = document.getElementById(`box${boxNumber}`);
        boxElement.classList.add('enlarge');
    });
}

function confettiEffect() {
    confetti({
        particleCount: 1000,
        spread: 150,
        origin: { y: 0.7 }
    });
}

function showHistoryButtons() {
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.marginTop = "20px";
    buttonContainer.style.flexWrap = "wrap";

    prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.onclick = showPreviousMove;
    buttonContainer.appendChild(prevButton);

    nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.onclick = showNextMove;
    buttonContainer.appendChild(nextButton);

    resetButton = document.createElement("button");
    resetButton.textContent = "Reset";
    resetButton.onclick = resetGame;
    buttonContainer.appendChild(resetButton);

    document.getElementById("container").appendChild(buttonContainer);

    updateButtonStates();

    winnerAnnouncement = document.createElement("div");
    winnerAnnouncement.setAttribute("id", "winnerAnnouncement");
    winnerAnnouncement.style.marginTop = "20px";
    document.getElementById("container").appendChild(winnerAnnouncement);
}

function showPreviousMove() {
    if (moveIndex > 0) {
        moveIndex--;
        loadBoard(gameHistory[moveIndex]);
        updateButtonStates();
    }
}

function showNextMove() {
    if (moveIndex < gameHistory.length - 1) {
        moveIndex++;
        loadBoard(gameHistory[moveIndex]);
        updateButtonStates();
    }
}

function loadBoard(boardState) {
    for (let i = 0; i < 9; i++) {
        let row = Math.floor(i / 3);
        let col = i % 3;
        document.getElementById(`box${i}`).textContent = boardState[row][col];
    }
}

function resetGame() {
    gameBoard = [
        ['', '', ''],
        ['', '', '']
    ];
    gameHistory = [];
    moveIndex = -1;
    playerTurn1 = true;
    gameFinished = false;

    removeHistoryButtons();

    announceWinner('');

    for (let i = 0; i < 9; i++) {
        document.getElementById(`box${i}`).textContent = '';
    }

    createBoard();
}

function removeHistoryButtons() {
    if (prevButton) prevButton.remove();
    if (nextButton) nextButton.remove();
    if (resetButton) resetButton.remove();
    if (winnerAnnouncement) winnerAnnouncement.remove();
}

function updateButtonStates() {
    prevButton.disabled = moveIndex <= 0;
    nextButton.disabled = moveIndex >= gameHistory.length - 1;
}

function announceWinner(message) {
    if (winnerAnnouncement) {
        winnerAnnouncement.textContent = message;
    }
}

createBoard();