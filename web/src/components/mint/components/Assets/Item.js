import React, { useEffect } from 'react';
import { Context } from '../../../../context';

const Item = ({ itemId }) => {

    const context = React.useContext(Context);
    const { actions } = context || {};
    const { getAttributes } = actions;

    const [imgId, setImgId] = React.useState(0);
    const [lvl, setLvl] = React.useState(0);

    const cached = 3;
    
    const image = `/static/monster-${itemId}.png`;

    const updateItem = async () => {
       const { monster, level } =  await getItem();
        setImgId(monster);
        setLvl(level);
    }

    const getItem = React.useCallback( async () =>{
        return getAttributes(itemId);
    }, [itemId, cached])

    useEffect(() => {
        updateItem();
    },[])

    if(!imgId)
        return <></>;
    return(
        <li>
            <div className='stake-item'>
                <img src={image} />
                <div>
                    <span>{itemId} - lvl: {lvl}</span>
                </div>
            </div>
        </li>
    )
}

export default React.memo(Item);