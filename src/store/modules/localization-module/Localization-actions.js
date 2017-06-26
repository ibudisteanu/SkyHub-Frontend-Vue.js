/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */

let axios = require ('axios');

export default {
    // ensure data for rendering given list type

    LOCALIZATION_NEW_IP: ({ commit, dispatch, state }, { ip }) => {

        return commit("SET_LOCALIZATION_IP",{ip});

    },

    LOCALIZATION_FETCH: async ({ commit, dispatch, state }, { ip }) => {

        if (state.request.done === true){
            return;
        }

        try {
            let res = await axios.get("http://freegeoip.net/json/" + ip||state.ip);

            res = res.data;

            var payload = {
                country: res.country_name || '',
                countryCode: res.country_code || '',
                city: res.city || '',
                latitude: res.latitude || '',
                longitude: res.longitude || '',
                clientIP: res.ip || '',
                timeZone: res.time_zone || '',
                request: {
                    sent: true,
                    done: true,
                    error: false,
                },
            };

            return await commit('SET_LOCALIZATION_DATA',{payload: payload});
        }
        catch(Exception){
            console.log("Promise Rejected",Exception);

            return await commit('SET_LOCALIZATION_REQUEST_ERROR',{});
        };

    },

}