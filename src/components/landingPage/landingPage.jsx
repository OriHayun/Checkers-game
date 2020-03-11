import React from 'react';

import './landingPage.css';


const landingPage = (props) =>{

    return (
    <div id="landingPage">
      <div>
        <p>Welcome to Checkers game</p>
        <button onClick={props.startGame}>Start play</button>
      </div>
    </div>
  );
}

export default landingPage;