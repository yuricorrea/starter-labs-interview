

const web3 = require("web3");
const NFT = require('./NFT.json');
const COIN = require('./COIN.json');
const URL = 'wss://polygon-mumbai.g.alchemy.com/v2/SCf7nFPerC9T0es5yYe8_4bt26ZWDap1'; 

const nftAddress = "0x7E11873e2b43994631a955390D43Bd81402aba58";
const coinAddress = "0x80dB8249A828ceFfe8CbefB49dF53eFa59d3d235";


async function get(type){
    const CONTRACT = type == 'nft' ? NFT : COIN;
    const address = type == 'nft' ? nftAddress : coinAddress;
    if(global[type])
        return global[type];
    const instance = new web3(URL);
    global[type] = new instance.eth.Contract(
        CONTRACT.abi,
        address
    )
    return global[type];
}

function nft(){
    return get('nft');
}

function coin(){
    return get('coin');
}

module.exports = {nft, coin};