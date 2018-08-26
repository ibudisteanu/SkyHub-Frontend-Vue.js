import Vue from 'vue'

export default {

    SET_GLOBAL_SCREEN: (state, {screenHeight, screenWidth}) => {
        state.screenHeight = screenHeight;
        state.screenWidth = screenWidth;
    },

    SET_GLOBAL_STATUS: (state, {statusType, statusMessage}) => {
        state.statusType = statusType;
        state.statusMessage = statusMessage;
    },

    SET_BOUNTY_COUNT_DOWN_FETCHING_NEW_LIST: (state, {bountyCountDownDate}) => {
        state.bountyCountDownDateFetchingNewList = bountyCountDownDate;
    },



}
