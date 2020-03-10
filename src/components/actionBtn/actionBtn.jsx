import React from 'react';
import './actionBtn.css'


const actionBtn = (props) => {

    
    let classes = "actionBtn " + props.btnClass
    if(props.disabled){
        return(
            <button className={classes} disabled>{props.name}</button>
        );
    }
    return (
        <button className={classes} onClick={props.func}>{props.name}</button>
    );
}
export default actionBtn;