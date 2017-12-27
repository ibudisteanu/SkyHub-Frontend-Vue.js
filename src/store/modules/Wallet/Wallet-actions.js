export default {
    // ensure data for rendering given list type

    WALLET_MENU_STATUS: ({ commit, dispatch, state }, { status }) => {

        return commit("SET_WALLET_MENU_STATUS",{status});

    },

    WALLET_MENU_INVERT: ({ commit, dispatch, state }, {  }) => {

        return commit("SET_WALLET_MENU_STATUS",{status: ! state.walletMenuStatus });

    },

}