import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import * as types from './types';
import NFT from '../contracts/NFT.json';
import Coin from '../contracts/COIN.json';
import Contract from 'web3-eth-contract';
import Minter from "./Minter";

const provider = "wss://polygon-mumbai.g.alchemy.com/v2/SCf7nFPerC9T0es5yYe8_4bt26ZWDap1";
Contract.setProvider(provider);
const web3 = new Web3(provider);

const nftAddress = "0x7E11873e2b43994631a955390D43Bd81402aba58";
const coinAddress = "0x80dB8249A828ceFfe8CbefB49dF53eFa59d3d235";

const chainId = web3.utils.toHex('80001');

export default (state, dispatch) => {

    let ethereum = {};
    const [nft, setNft] = useState(null);
    const [coin, setCoin] = useState(null);
    const [isChain, setChain] = useState(false);
    const [price, setPrice] = useState('-');

    const isMetaMaskInstalled = () => {
        const { isMetaMask } = ethereum || false;
        dispatch({
            type: types.SET_METAMASK_INSTALLED,
            isMetaMask
        })
        
    }

    const initializeContracts = async () => {
        const networkId = await web3.eth.net.getId();
        if(networkId == 80001)
            setChain(true);
        setNft(new web3.eth.Contract(
            NFT.abi,
            nftAddress
        ));
        setCoin(new web3.eth.Contract(
            Coin.abi,
            coinAddress
        ))
    }

    const changeAccount = (accounts) => {
        dispatch({
            type: types.SET_ACCOUNT,
            account: accounts[0] || null
        });
        dispatch({
            type: types.SET_CONNECTION,
            connected: accounts?.length > 0 
        })
    }

    const listeners = () => {
        window?.ethereum?.on('chainChanged', (cId) => {
            console.log(cId);
            if(chainId != cId){
                setChain(false);
                return;
            }
            setChain(true);
        });
        window?.ethereum?.on('accountsChanged', (accounts) => {
            changeAccount(accounts);
          });
        window?.ethereum?.on('connect', async () => {
            const accounts = await ethereum?.request({ method: 'eth_accounts' })
            changeAccount(accounts);
        })
        if(window?.ethereum?.selectedAddress){
            changeAccount([ethereum?.selectedAddress]);
        }
    }

    useEffect(() => {
        ethereum = window?.ethereum || {};
        isMetaMaskInstalled();
        listeners();
        initializeContracts();
    },[])

    useEffect(() => {
        if(nft != null && coin != null){
            updatePrice();
            dispatch({
                type: types.LOAD_CONTRACTS
            })
        }
    }, [nft, coin])

    const connectWallet = async () => {
        if(state?.loadingWallet)
            return;
        web3.setProvider(provider);
        dispatch({
            type: types.SET_LOADING_WALLET,
            loadingWallet: true
        })
        try{
            const accounts = await window?.ethereum?.request({  
                method: 'eth_requestAccounts',
                params: [{ eth_accounts: {} }], 
            });
           if(accounts.length)
            changeAccount(accounts);
        } catch(e) { console.log(e)}
        dispatch({
            type: types.SET_LOADING_WALLET,
            loadingWallet: false
        })
    }

    const connectButtonLabel = useCallback((label) => {
        return (state?.loaded && nft != null) ? 
            state?.isMetaMask ? 
                state?.connected ? label : 'Connect Wallet' 
            : 'Open on MetaMask' 
        : 'Wait...'
    }, [state]);

    const changeNetwork = async () => {
        try {
            await window?.ethereum?.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId }],
            });
        } catch (switchError) {
            try {
                await window?.ethereum?.request({
                  method: 'wallet_addEthereumChain',
                  params: [{ 
                      chainId,
                      rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
                      chainName: "Mumbai Testnet",
                      nativeCurrency: {
                        name: "Matic",                       
                        symbol: "Matic",                    
                        decimals: 18,                
                    },
                    blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com"],
                    }],
                });
            } catch (addError) {
                // handle "add" error
                console.log(addError)
            }
            // handle other "switch" errors
        }
        
    }
    
    const getPrice = () => {
        return nft?.methods?.price().call();
    }

    const getAllowance = () => {
        return coin?.methods?.allowance(state?.account, nftAddress)?.call();
    }

    const getCoinBalance = async () => {
        return coin?.methods?.balanceOf(state?.account).call();
    }

    const allow = () => {
        return window?.ethereum?.request({
            method: 'eth_sendTransaction',
            params: [{
                to: coinAddress,
                from: state?.account,
                'data': coin?.methods?.approve(nftAddress, web3.utils.toWei(`1000`, 'ether'))?.encodeABI(),
            }]
        })
    }

    const updatePrice = async () => {
        const p = await getPrice();
        setPrice(web3.utils.fromWei(p,'ether'));
    }

    return {
        web3,
        nft,
        coin,
        price,
        isChain,
        connectWallet,
        connectButtonLabel,
        changeNetwork,
        getAllowance,
        allow,
        minted: () => {
            return nft?.methods?.totalSupply()?.call();
        },
        isMintOpen: () => {
            return nft?.methods?.mintOpen()?.call();
        },
        balance: () => {
            return nft?.methods?.balanceOf(state?.account)?.call();
        },
        buy: async (qty,allowed) => {
            if(!allowed){
                alert('You need to allow us to use your SLABS first!')
                return allow();
            }
            const tx = await window?.ethereum?.request({
                method: 'eth_sendTransaction',
                params: [{
                    to: nftAddress,
                    from: state?.account,
                    'data': nft?.methods?.mint(qty)?.encodeABI(),
                }]
            })
            return tx;
        },
        getMyAssets: async () => {
            return [];
        },
        getCoinBalance
    }
}