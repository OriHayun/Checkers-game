import React from 'react';
import './piece.css';

const piece = (props) => {
    let classes = "";
    if (props.checker) {
        classes += props.PLAYERS[props.checker.player].class;
        if (props.checker.isKing) {
            classes += " king";
        }
    }
    return (
        <div className={classes}></div>
    )
}

export default piece;
