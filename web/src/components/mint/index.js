import React from 'react';
import { Context } from '../../context';
import Minter from '../../context/Minter';
import { Buy, Button } from  './components';

const Mint = () => {

    const context = React.useContext(Context);
    const { actions, state } = context || {};
    const { isMetaMask } = state;
    const { contractLoaded, account } = state;
    const { connectWallet, getCoinBalance, web3, price } = actions;

    const [balance, setBalance] = React.useState('-');

    const uniswapLink = 'https://app.uniswap.org/#/swap?chain=polygon_mumbai&outputCurrency=0x80dB8249A828ceFfe8CbefB49dF53eFa59d3d235';

    const isActive = Minter.active;

    const handleConnectWallet = () => {
        if(!isMetaMask){
            location.href = `https://metamask.app.link/dapp/${location.href}`;
            return;
        }
        if(isActive)
            connectWallet()
    }

    const updateMonsters = (event) => {

    }

    const updateBalance = async () => {
      const b = await getCoinBalance();
      if(balance != b)
        setBalance(web3?.utils?.fromWei(b, 'ether'))
    }

    React.useEffect(() => {
      if(account != null && contractLoaded){
        updateBalance();
      }
    }, [account,contractLoaded ])

    return (
        <section className="mint">
        <div className="mint-container wrapper">
          <h2 className="mint-container__title">
            {Minter.text}
          </h2>
          <p className="mint-container__text">
            PRICE: {price} SLABS
          </p>
          {(account == null || !isActive) ? (
              <Button 
                onClick={handleConnectWallet}
                text={Minter.active ? 'CONNECT YOUR WALLET' : Minter.text}
                active={Minter.active}
              />
          ) : (
            <React.Fragment>
              <div className="mint-container__label">
                <Buy onCreatingComplete={updateMonsters} />
              </div>
              <div className="mint-container__status connected">
                <span className="mint-container__status__box connected"></span>
                <span>{account.slice(0, 5)}...{account.slice(38, 42)} Connected</span>
              </div>
                <p className="mint-container__text">
                  Balance: {balance} SLABS - <a href={uniswapLink} target="_blank">BUY MORE</a>
                </p>
            </React.Fragment>
          )}
        </div>
      </section>
    )
}

export default React.memo(Mint);