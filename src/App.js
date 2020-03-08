import React, { Component } from 'react';
import './App.css';
import GameBoard from './components/board/board.jsx';
import ActionBtn from './components/actionBtn/actionBtn.jsx';
import Winner from './components/winner/winner.jsx';

import Board from './models/board';

const BOARD_SIZE = 8;
const PLAYER_ONE = 1;
const PLAYER_TWO = 2;
const PLAYERS = {
  [PLAYER_ONE]: {
    name: "Ori Hauyn",
    class: "player-one"
  },
  [PLAYER_TWO]: {
    name: "Raz Gross",
    class: "player-two"
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      board: new Board(PLAYER_ONE, PLAYER_TWO, BOARD_SIZE),
      turn: PLAYER_ONE,
      selectedSquare: null,
      winner: null,
      undoBtn: "disabled",
      redoBtn: "disabled",
      finishBtn: "disabled"
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.turn != this.state.turn) {
      let board = this.state.board;
      if (!board.hasMoves(this.state.turn)) {
        console.log("no available moves");
        this.setState({ winner: this.nextPlayer() });
      }
    }
  }

  selectedSquare = (row, column) => {
    let selected = this.state.selectedSquare;
    if (this.canSelectSquare(row, column)) {
      this.setState({ selectedSquare: { row: row, column: column } })
    }
    else if (selected != null) {
      this.makingMove(row, column);
    }
  }

  canSelectSquare = (row, column) => {
    let square = this.state.board.board[row][column];
    if (square === 0) {
      square = 1;
    }
    if (!square) {
      return false;
    }
    let player = this.state.board.checkers[square].player;
    return player === this.state.turn;
  }

  makingMove = (nextRow, nextColumn) => {
    let board = this.state.board;
    let selected = this.state.selectedSquare;
    let selectedChecker = board.board[selected.row][selected.column];
    if (!board.checkIfValid(selectedChecker, nextRow, nextColumn)) {
      console.log("illegal move");
      return;
    }

    let isJump = board.isJumpMove(selectedChecker, nextRow); //return true or false
    let becameKing = false;
    board.moveChecker(selectedChecker, nextRow, nextColumn);
    if (!board.isKing(selectedChecker) &&
      (board.getPlayer(selectedChecker) == PLAYER_ONE && nextRow == 0)
      ||
      (board.getPlayer(selectedChecker) == PLAYER_TWO && nextRow == ((board.board.length) - 1))) {

      becameKing = true;
      board.makeKing(selectedChecker);
    }
    //this.setState({undoBtn:""})
    if (!becameKing && isJump && board.canKeepJumping(selectedChecker)) {
      this.setState({ board: board, selectedSquare: { row: nextRow, column: nextColumn } });
    } else {
      this.setState({ board: board, turn: this.nextPlayer(), selectedSquare: null });
    }
  }

  nextPlayer = () => {
    return (this.state.turn == PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE);
  }

  restart = () => {
    this.setState({
      board: new Board(PLAYER_ONE, PLAYER_TWO,BOARD_SIZE),
      turn: PLAYER_ONE,
      selectedSquare: null,
      winner: null
    });
  }

  render() {

    let classTurn = this.state.turn === 1 ? "player-one-turn" : "player-two-turn"

    return (
      <div className="App">
        <div>
          <h1>Checker - React </h1>
        </div>
        <h2 className={classTurn}>current turn : player {this.state.turn}</h2>
        {this.state.winner &&
          <Winner PLAYER={PLAYERS} winner={this.state.winner} restart={this.restart} />
        }
        <div>
          <GameBoard
            board={this.state.board}
            selectedSquare={this.state.selectedSquare}
            PLAYERS={PLAYERS}
            selectedSquareFunc={this.selectedSquare}
          />
        </div>
        <ActionBtn name="<< Undo" btnClass="undo" disabled={this.state.undoBtn} />
        <ActionBtn name="Finish" btnClass="finish" disabled={this.state.finishBtn} />
        <ActionBtn name="Redo >>" btnClass="redo" disabled={this.state.redoBtn} />
      </div>
    );
  }
}

export default App;
