/*
        I USE VUEX SAGA for ASYNC actions
 */

import Vue from 'vue'
import Vuex from 'vuex'

import WalletModule from './modules/Wallet/Wallet-module'
import GlobalModule from './modules/Global/Global-module'
import MiningModule from './modules/Mining/Mining-module'

Vue.use(Vuex);

export function createStore () {
    return new Vuex.Store({
        modules: {

            wallet: WalletModule ,
            global: GlobalModule,
            mining: MiningModule,


        }
    });
}

