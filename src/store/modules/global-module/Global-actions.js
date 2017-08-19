/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */


export default{

    GLOBAL_NEW_AUTHENTICATION_MODAL: ({ commit }, { refAuthenticationModal }) => {

        commit('SET_GLOBAL_AUTHENTICATION_MODAL', {refAuthenticationModal});

    },

    GLOBAL_NEW_MODAL: ({ commit }, { refModal }) => {

        commit('SET_GLOBAL_MODAL', {refModal});

    },

}

