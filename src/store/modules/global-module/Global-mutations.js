/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */


export default{

    SET_GLOBAL_AUTHENTICATION_MODAL: (state, { refAuthenticationModal }) => {
        state.refAuthenticationModal = refAuthenticationModal;
    },

    SET_GLOBAL_MODAL: (state, { refModal }) => {
        state.refModal = refModal;
    },

    SET_APPLICATION_NAME: (state, { applicationName }) => {

        state.applicationName = applicationName;

    },

}