import React from 'react';
import { Context } from '../../../context';
import Button from './Button';

const Buy = ({ onCreatingComplete }) => {

    const context = React.useContext(Context);
    const { actions, state } = context || {};
    const { connected, account, contractLoaded } = state;
    const { getAllowance, allow, buy, coin, nft, price, isChain, changeNetwork, web3 } = actions;

    const [qty, setQty] = React.useState(1);
    const [allowed, setAllowed] = React.useState(0);

    const [minting, setMinting] = React.useState(false);
    const [creating, setCreating] = React.useState(false);
    const [allowing, setAllowing] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const isAllowed = allowed > web3.utils.fromWei(price,'ether');

    const updateAllowance =  async () => {
        const a = await getAllowance();
       if(a){
           setAllowed(web3.utils.fromWei(a,'ether'));
       }
    }

    const successFeedback = () => {
        alert('transaction submitted. waiting confirmation.');
    }

    const handleMintPress = async () => {
        try{
            if(minting || creating)
                return;
            if(!isChain){
                return changeNetwork();
            }
            if(!isAllowed) {
                setLoading(true);
                const tx = await allow();
                if(tx){
                    successFeedback();
                    setAllowing(true);
                }
                setLoading(false);
                return;
            }
            setLoading(true);
            const tx = await buy(qty, isAllowed);
            if(tx){
                    successFeedback();
                    setMinting(true);
            }
        } catch(e){}
            setLoading(false);
    }

    const onErrorEvent = (e) => {
        alert(e?.message);
        window.location.reload();
    }

    const isEqual = (w1, w2) => `${w1}`.toLocaleLowerCase() == `${w2}`.toLocaleLowerCase();

    const contractListeners = () => {
        nft?.events?.Mint()
            .on('data', (event) => {
                if(isEqual(event?.returnValues?.owner,account)){
                    setMinting(false);
                    setCreating(true);
                }
            })
            .on('error',onErrorEvent);
        nft?.events?.CreateMonster()
            .on('data', (event) => {
                if(isEqual(event?.returnValues?.owner,account)){
                    setCreating(false);              
                    onCreatingComplete(event);
                    alert('Your monster is ready!');
                }
            })
            .on('error', onErrorEvent)
        coin?.events?.Approval()
            .on('data', (event) => {
                if(isEqual(event?.returnValues?.owner,account)){
                    updateAllowance();
                    setAllowing(false);
                }
            } )
            .on('error',onErrorEvent);
    }

    React.useEffect(() => {
        if(account && connected && contractLoaded){
            updateAllowance();
            contractListeners();
        }
    }, [connected, account, contractLoaded])

    const handleChangeQty = (e) => {
        setQty(e.target.value);
    }

    const getText = () => {
        if(!contractLoaded)
            return '';
        if(!isChain)
            return 'CHANGE NETWORK';
        if(allowing)
            return 'ALLOWING SLABS...';
        if(minting)
            return 'MINTING YOUR MONSTER...';
        if(creating)
            return 'TREINING YOUR MONSTER...';
        return isAllowed ? 'MINT' : 'ALLOW';
    }

    return (
        <div id="mint-action">
            
            {/* <div id="pay-using">
                <span>quantity</span>
                <input type="number" value={qty} onChange={handleChangeQty} />
            </div> */}
            <Button 
                active={!minting && !creating && !allowing && !loading}
                onClick={handleMintPress}
                text={getText()}
            />
        </div>
    )
}

export default React.memo(Buy);