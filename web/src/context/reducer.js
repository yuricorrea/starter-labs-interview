import * as types from './types';

export const initialState = {
    connected: false,
    isMetaMask: false,
    loaded: false,
    loadingWallet: false,
    account: null,
    contractLoaded: false
}

export const reducer = (state, action) => {
    const { type, connected, isMetaMask, loadingWallet, account } = action;
    switch(type){
        case types.SET_CONNECTION:
            return {
                ...state,
                connected
            }
        case types.SET_METAMASK_INSTALLED:
            return {
                ...state,
                loaded: true,
                isMetaMask
            }
        case types.SET_LOADING_WALLET:
            return {
                ...state,
                loadingWallet
            }
        case types.SET_ACCOUNT:
            return {
                ...state,
                account
            }
        case types.LOAD_CONTRACTS:
            return {
                ...state,
                contractLoaded: true
            }
        default:
            return state;
    }
}