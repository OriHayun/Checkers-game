function Board(player_one, player_two, size) {
    this.player_one = player_one;
    this.player_two = player_two;
    this.board = this.fillBoard(this.createBoard(size))
    this.checkers = this.buildCheckersArray(size, player_one, player_two)
}


Board.prototype.createBoard = function (size) {
    let board = [];

    for (let i = 0; i < size; i++) {
        board.push(Array(size).fill(null))
    }
    return board
}

Board.prototype.fillBoard = function (board) {
    let size = board.length;
    let count = 0;
    let row = size - 1, row2 = 0;

    for (let i = 0; i < 3; i++) {
        for (let col = 0; col < size; col += 2) {
            if (i % 2 == 1) {
                board[row - i][col + 1] = count;
                board[row2 + i][col] = (size / 2) * 3 + count;
            } else {
                board[row - i][col] = count;
                board[row2 + i][col + 1] = (size / 2) * 3 + count;
            }
            count++;
        }
    }
    return board;
}

Board.prototype.buildCheckersArray = function (size, player_one, player_two) {
    let checkers = [];
    let num = (size / 2) * 3; //12
    let row = size - 1 //7
    let col = 0; //0
    for (let i = 0; i < num; i++) {
        if (i && i % (size / 2) === 0) {
            row--;
            col = i == size ? 0 : 1;
        }
        checkers.push({ player: player_one, isKing: false, row: row, col: col, removed: false });
        col += 2;
    }

    row = 0;
    col = 1;
    for (let i = 0; i < num; i++) {
        if (i && i % (size / 2) === 0) {
            row++;
            col = i == size ? 1 : 0;
        }
        checkers.push({ player: player_two, isKing: false, row: row, col: col, removed: false });
        col += 2;
    }
    return checkers;

}

Board.prototype.checkIfValid = function (selectedChecker/*11*/, nextRow, nextCol) {
    let turn = this.checkers[selectedChecker].player
    if (!this.forceJump(selectedChecker, turn)) {
        return false
    }

    let allMoves = this.getAllMoves(selectedChecker);
    for (let move in allMoves.singles) {
        if (allMoves.singles[move].row == nextRow && allMoves.singles[move].col == nextCol) {
            return true
        }
    }
    for (let move in allMoves.jumps) {
        if (allMoves.jumps[move].row == nextRow && allMoves.jumps[move].col == nextCol) {
            return true
        }
    }
    return false;
}

Board.prototype.forceJump = function (selectedChecker, turn) {
    let checkers = this.checkers;
    let counter = 0
    //אם לשחקן שבחרתי יש קפיצה
    let selectedCheckerMoves = this.getAllMoves(this.board[checkers[selectedChecker].row][checkers[selectedChecker].col])
    if (selectedCheckerMoves.jumps.length) {
        return true
    }
    //אם למישהו אחר יש קפיצה 
    for (let i = 0; i < checkers.length; i++) {
        if (this.board[checkers[i].row][checkers[i].col]) {
            if (checkers[i].removed == false && checkers[i].player == turn) {
                let selectedCheckerMoves = this.getAllMoves(this.board[checkers[i].row][checkers[i].col])
                if (selectedCheckerMoves.jumps.length) {
                    return false;
                }
            }

        }
    }

    /*for (let i = 0; i < tmpCheckers.length; i++) {
        if (this.board[tmpCheckers[i].row][tmpCheckers[i].col]) {
            console.log(tmpCheckers[i].row,tmpCheckers[i].col)
            let selectedCheckerMoves = this.getAllMoves(this.board[tmpCheckers[i].row][tmpCheckers[i].col])
            if (selectedCheckerMoves.jumps.length) {
                return false;
            }
        }
    }*/
    return true;
}

Board.prototype.getAllMoves = function (selectedChecker) {
    let singles = [];
    let jumps = [];
    let c = this.checkers[selectedChecker];

    let topRow = c.row - 1;
    let bottomRow = c.row + 1;
    let leftCol = c.col - 1;
    let rightCol = c.col + 1;

    if (c.player == this.player_one || c.isKing) {
        jumps = this.checkJumps(topRow, topRow - 1, leftCol, rightCol, leftCol - 1, rightCol + 1, c.player);
        if (!jumps.length) {
            singles = this.checkAdjacent(topRow, leftCol, rightCol);
        }

    }
    if (c.player == this.player_two || c.isKing) {
        jumps = jumps.concat(this.checkJumps(bottomRow, bottomRow + 1, leftCol, rightCol, leftCol - 1, rightCol + 1, c.player));
        if (!jumps.length) {
            singles = singles.concat(this.checkAdjacent(bottomRow, leftCol, rightCol));
        }
    }
    return { singles: singles, jumps: jumps };
}

Board.prototype.checkJumps = function (row, nextRow, left, right, nextLeft, nextRight, player) {
    let jumps = [];
    if (row >= this.board.length || row < 0 || nextRow >= this.board.length || nextRow < 0) {
        return jumps;
    }

    let adjacent = this.board[row][left];
    if (adjacent != null && this.checkers[adjacent].player !== player) {
        if (this.board[nextRow][nextLeft] === null) {
            jumps.push({ row: nextRow, col: nextLeft });
        }
    }
    adjacent = this.board[row][right];
    if (adjacent != null && this.checkers[adjacent].player !== player) {
        if (this.board[nextRow][nextRight] === null) {
            jumps.push({ row: nextRow, col: nextRight });
        }
    }
    return jumps;
}

Board.prototype.checkAdjacent = function (row, left, right) {
    let singles = [];
    if (row >= this.board.length || row < 0) {
        return singles;
    }
    let adjacent = this.board[row][left];
    if (adjacent == null) {
        singles.push({ row: row, col: left })
    }
    adjacent = this.board[row][right];
    if (adjacent == null) {
        singles.push({ row: row, col: right })
    }
    return singles;
}

Board.prototype.isJumpMove = function (selectedChecker, row) {
    return Math.abs(this.checkers[selectedChecker].row - row) === 2;
}

Board.prototype.moveChecker = function (selectedChecker, row, col) {
    let c = this.checkers[selectedChecker];
    let prevSituation = {
        board: {
            player_one: this.player_one,
            player_two: this.player_two,
            board: this.board,
            checkers: this.checkers
        },
        selectedSquare: selectedChecker,
        turn: c.player
    }
    localStorage.setItem('prevSituation', JSON.stringify(prevSituation));
    let cRow = c.row;
    let cCol = c.col;

    if (this.isJumpMove(selectedChecker, row)) {
        let midRow = (cRow + row) / 2;
        let midCol = (cCol + col) / 2;
        let removedPlayer = this.board[midRow][midCol];
        this.board[midRow][midCol] = null;
        this.checkers[removedPlayer].removed = true;
    }
    c.row = row;
    c.col = col;
    this.board[cRow][cCol] = null;
    this.board[row][col] = selectedChecker;
}

Board.prototype.isKing = function (selectedChecker) {
    let c = this.checkers[selectedChecker];
    return c.isKing;
}

Board.prototype.getPlayer = function (selectedChecker) {
    let c = this.checkers[selectedChecker];
    return c.player;
}

Board.prototype.makeKing = function (selectedChecker) {
    let c = this.checkers[selectedChecker];
    c.isKing = true;
}

Board.prototype.canKeepJumping = function (selectedChecker) {
    let moves = this.getAllMoves(selectedChecker).jumps;
    if (moves.length) {
        return true;
    }
    return false;
}

Board.prototype.hasMoves = function (player) {
    let checkers = this.checkers;
    if (player == 1) {
        let counter = 0
        for (let i = 0; i < 12; i++) {
            if (checkers[i].removed == true) {
                counter++
            }
        }
        if (counter == 12) {
            return false;
        }
    }
    else {
        let counter = 0;
        for (let i = 12; i < 24; i++) {
            if (checkers[i].removed == true) {
                counter++
            }
        }
        if (counter == 12) {
            return false;
        }
    }
    return true;
}

module.exports = Board;




