import React from 'react';
import Piece from '../piece/piece.jsx'

import './square.css'

const square = (props) => {

    let color = (props.rowNum + props.colNum) % 2 === 0 ? "lightgrey" : "black";
    let selection = props.selected ? " selected" : "";
    let classes = "square " + color + selection;


    return (
        <div className={classes} onClick={() => props.selectedSquareFunc(props.rowNum,props.colNum)}>
            {props.val != null &&
                <Piece
                    checker={props.val}
                    PLAYERS={props.PLAYERS}
                />
            }
        </div>
    );
}

export default square;