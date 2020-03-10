import React from 'react';
import Row from '../row/row.jsx';

import './board.css';

const gameBoard = (props) => {
    let selectedRow = props.selectedSquare ? props.selectedSquare.row : null;
    let rows = props.board.board.map((row, index) => {
        return (
            <Row
                key={index}
                row={row}
                rowNum={index}
                selectedSquare={index === selectedRow ? props.selectedSquare : null}
                checkers={props.board.checkers}
                PLAYERS={props.PLAYERS}
                selectedSquareFunc = {props.selectedSquareFunc}
            />
        );
    })

    return (
        <div className="board">
            {rows}
        </div>
    );
}

export default gameBoard;