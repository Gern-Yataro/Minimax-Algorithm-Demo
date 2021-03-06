var boardGrid;
var huPlayer = "O";
var aiPlayer = "X";
var firstAIMove = true;
const winCombo = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  boardGrid = Array.from(Array(9).keys());
  for(i = 0; i < cells.length; i++){
    cells[i].innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

//initialise board with empty cells
function startGame() {
  firstAIMove = true;
  document.querySelector(".endgame").style.display = "none";
  boardGrid = Array.from(Array(9).keys());
  for(i = 0; i < cells.length; i++){
    cells[i].innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

//register clicked cell
function turnClick(square) {
  if(typeof boardGrid[square.target.id] == 'number'){
    turn(square.target.id, huPlayer);
    if (!checkTie() && firstAIMove == false) setTimeout(function(){turn(bestSpot(), aiPlayer); }, 100);
    if (firstAIMove == true) turn(firstAISpot(), aiPlayer);
  }

}

function turn(squareId, player) {
  boardGrid[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(boardGrid, player);
  if(gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombo.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}


function gameOver(gameWon) {
  for(let index of winCombo[gameWon.index]){
    document.getElementById(index).style.backgroundColor = 
      gameWon.player == huPlayer ? "#64B5F6" : "#E57373";
  }
  for(var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  declareWinner((gameWon.player == huPlayer) ? "You Win!" : "Computer Wins!");
}

function emptySquares() {
  return boardGrid.filter(s => typeof s == "number");
}

function declareWinner(who){
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerHTML = who;
}

function bestSpot() {
  return minimax(boardGrid, aiPlayer, 0).index;
}

function firstAISpot() {
  firstAIMove = false;
  var corners = [0, 2, 6, 8];
  var availSpots = emptySquares();
  if(availSpots.indexOf(4) !== -1){
      return 4;
  }
  var availCornerSpots = availSpots.filter(value => -1 !== corners.indexOf(value));
  return availCornerSpots[Math.floor(Math.random() * availCornerSpots.length)];
}

function checkTie() {
  if(emptySquares().length == 0) {
    for(var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "#81C784";
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

function minimax(newBoard, player, depth) {
	var availSpots = emptySquares();

  //checks for terminal states (win/lose)
	if (checkWin(newBoard, huPlayer)) {
    var temp = -10 + depth;
		return {score: temp};
	} else if (checkWin(newBoard, aiPlayer)) {
    var temp = 10 - depth;
		return {score: temp};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
  
  //minimax recursion for each empty cell
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
      var tempDepth = depth + 1;
			var result = minimax(newBoard, huPlayer, tempDepth);
			move.score = result.score;
		} else {
      var tempDepth = depth + 1;
			var result = minimax(newBoard, aiPlayer, tempDepth);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}
