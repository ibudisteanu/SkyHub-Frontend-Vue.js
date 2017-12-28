import Vue from 'vue'

import Wallet from 'models/Wallet';

export default {

    SET_WALLET_MENU_STATUS: (state, {status}) => {
        state.walletMenuStatus = status;
    },


    ADD_WALLETS_ADDRESSES: (state, {addresses}) =>{

        if (Array.isArray(addresses)) addresses = [addresses]


        for (let i=0; i<addresses.length; i++){

            let wallet = new Wallet(addresses[i]);

            Vue.set(state.walletAddresses, wallet.id, wallet );
        }

    },

    ADD_WALLETS_ADDRESS: (state, { wallet }) => {

        let newWallet = new Wallet(wallet);

        Vue.set(state.walletAddresses, newWallet.id, newWallet );

    },


    SET_WALLETS_CLEAR : (state, { }) => {

        state.walletAddresses = {};

    },

}
