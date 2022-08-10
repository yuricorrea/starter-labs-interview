import React from 'react';

const Button = ({ onClick, text, active}) => {

    const handleClick = (e) => {
        e?.preventDefault();
        if(!active)
            return;
        onClick();
    }

    return(
        <div href="javascript:" onClick={handleClick}>
        <span
            className="mint-container__button "
           
        >
              <a href="javascript:" class="btn" style={{ opacity: active ? 1 : 0.5}}>{text}</a>
        </span>
        </div>
    )

}

export default Button;