import React from 'react';
import Square from '../square/square.jsx';
import './row.css'

const row = (props) => {

    let selectedCol = props.selectedSquare ? props.selectedSquare.column : null;
    let squares = props.row.map((square, index) => {
        return (
            <Square
                key={index}
                val={square != null ? props.checkers[square] : null}
                selected={index === selectedCol ? true : false}
                rowNum={props.rowNum}
                colNum={index}
                PLAYERS={props.PLAYERS}
                selectedSquareFunc = {props.selectedSquareFunc}
            />
        );
    })

    return (
        <div className="row">
            {squares}
        </div>
    );
}

export default row;