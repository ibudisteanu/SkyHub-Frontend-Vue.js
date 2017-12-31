import Vue from 'vue'

export default {

    SET_MINING_NEW_STATUS: (state, {status}) => {
        state.startedMining = status;
    },


}
