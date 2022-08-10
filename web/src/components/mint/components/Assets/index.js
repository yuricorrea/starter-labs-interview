import React from 'react';
import Item from './Item';

const Stake = ({ assets }) => {

    if(!assets.length)
        return <></>
    return (
            <div className="mint-container wrapper">
                   <h2> My Assets</h2>
                  <div className="stake-main">
                        <div className="to-stake stake-wrapper">
                            <ul>
                                {assets.map(i => <Item key={i} itemId={i} />)}
                            </ul>
                        </div>
                  </div>
            </div>
    )
}

export default React.memo(Stake);