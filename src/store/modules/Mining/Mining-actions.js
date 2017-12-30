export default {
    // ensure data for rendering given list type

    MINING_CHANGE_WORKERS: ({ commit, dispatch, state }, { workers }) => {

        if (workers > 0)
            return dispatch('MINING_START', {});
        else
            return dispatch('MINING_STOP', {});

    },

    MINING_START: ({ commit, dispatch, state }, {  }) => {

        return commit("SET_MINING_NEW_STATUS",{status:true});

    },

    MINING_STOP: ({ commit, dispatch, state }, { }) => {

        return commit("SET_MINING_NEW_STATUS",{status:false});

    },


}