export default {
    // ensure data for rendering given list type

    WALLET_MENU_STATUS: ({ commit, dispatch, state }, { status }) => {

        return commit("SET_WALLET_MENU_STATUS",{status});

    },

    WALLET_MENU_INVERT: ({ commit, dispatch, state }, {  }) => {

        return commit("SET_WALLET_MENU_STATUS",{status: ! state.walletMenuStatus });

    },

    WALLET_CREATE_NEW_ADDRESS: ({ commit, dispatch, state }, {  }) => {


        try {

            let wallet = WebDollar.Blockchain.Wallets.createNewAddress();
            return commit("ADD_WALLETS_ADDRESS",{wallet: wallet });

        } catch (exception){
            console.log("Couldn't create a new address")
        }

    },

}