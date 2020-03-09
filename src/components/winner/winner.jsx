import React from 'react';

import './winner.css';


const winner = (props) =>{
    let player = props.PLAYER[props.winner].name;
  return (
    <div id="winner">
      <div>
        <p>{player} has won the game!</p>
        <button onClick={props.restart}>Play again?</button>
      </div>
    </div>
  );
}

export default winner;