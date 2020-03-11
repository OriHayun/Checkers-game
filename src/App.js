import React, { Component } from 'react';
import './App.css';
import GameBoard from './components/board/board.jsx';
import ActionBtn from './components/actionBtn/actionBtn.jsx';
import Winner from './components/winner/winner.jsx';

import LandingPage from './components/landingPage/landingPage.jsx';

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

  startGame = () => {
    this.setState({ started: 1 })
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
    this.setState({ undoBtn: "" })
    board.moveChecker(selectedChecker, nextRow, nextColumn);
    if (!board.isKing(selectedChecker) &&
      (board.getPlayer(selectedChecker) == PLAYER_ONE && nextRow == 0)
      ||
      (board.getPlayer(selectedChecker) == PLAYER_TWO && nextRow == ((board.board.length) - 1))) {

      becameKing = true;
      board.makeKing(selectedChecker);
    }

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
      board: new Board(PLAYER_ONE, PLAYER_TWO, BOARD_SIZE),
      turn: PLAYER_ONE,
      selectedSquare: null,
      winner: null,
      lastBoard: null,
      lastSelectedSquare: null,
      lastTurn: null,
      undoBtn: "disabled",
      redoBtn: "disabled",
      started: null
    });
  }

  undoBtn = () => {
    let nextSituation = {
      board: {
        player_one: this.state.player_one,
        player_two: this.state.player_two,
        board: this.state.board,
        checkers: this.state.board.checkers
      },
      selectedSquare: this.state.selectedSquare,
      turn: this.state.turn
    }
    localStorage.setItem('nextSituation', JSON.stringify(nextSituation));

    let prevSituation = JSON.parse(localStorage.getItem('prevSituation'));
    console.log(prevSituation)

    let b = new Board()
    b.player_one = prevSituation.board.player_one;
    b.player_two = prevSituation.board.player_two;
    b.board = prevSituation.board.board;
    b.checkers = prevSituation.board.checkers;
    console.log(b)

    this.setState({
      board: b,
      turn: prevSituation.turn,
      selectedSquare: prevSituation.selectedSquare,
      undoBtn: "disabled",
      redoBtn: ""
    }, () => console.log(this.state))
  }

  redoBtn = () => {

    let nextSituation = JSON.parse(localStorage.getItem('nextSituation'));
    console.log(nextSituation);

    let b = new Board()
    b.player_one = nextSituation.board.board.player_one;
    b.player_two = nextSituation.board.board.player_two;
    b.board = nextSituation.board.board.board;
    b.checkers = nextSituation.board.board.checkers;
    console.log(b)

    this.setState({
      board: b,
      turn: nextSituation.turn,
      selectedSquare: nextSituation.selectedSquare,
      undoBtn: "",
      redoBtn: "disabled"
    }, () => console.log(this.state))
  }

  render() {

    let classTurn = this.state.turn === 1 ? "player-one-turn" : "player-two-turn"

    return (
      <div className="App">
        {!this.state.started &&
          <LandingPage startGame={this.startGame} />
        }
        {this.state.winner &&
          <Winner PLAYER={PLAYERS} winner={this.state.winner} restart={this.restart} />
        }
        <div>
          <h1>Checker - React </h1>
        </div>
        <h2 className={classTurn}>current turn :  {this.state.turn == 1 ? "Ori Hayun" : "Raz Gross"}</h2>
        <div>
          <GameBoard
            board={this.state.board}
            selectedSquare={this.state.selectedSquare}
            PLAYERS={PLAYERS}
            selectedSquareFunc={this.selectedSquare}
          />
        </div>
        <ActionBtn name="<< Undo" btnClass="undo" disabled={this.state.undoBtn} func={this.undoBtn} />
        <ActionBtn name="Redo >>" btnClass="redo" disabled={this.state.redoBtn} func={this.redoBtn} />
      </div>
    );
  }
}

export default App;
