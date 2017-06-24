/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */


export default {
    // ensure data for rendering given list type

    LOCALIZATION_EXTRACT_IP_SERVER_SIDE: async ({ commit, dispatch, state }, { req }) => {

        let ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
        //const requestIp = require('request-ip');
        //const ip = requestIp.getClientIp(req);

        console.log('IP::'); console.log(ip);

        return await commit('LOCALIZATION_SET_IP', { ip: ip });

    },

    LOCALIZATION_FETCH: async ({ commit, dispatch, state }, { sIP }) => {

        try {
            let res = await axios.get("http://freegeoip.net/json/" + state.IP);

            res = res.data;

            var payload = {
                country: res.country_name || '',
                countryCode: res.country_code || '',
                city: res.city || '',
                latitude: res.latitude || '',
                longitude: res.longitude || '',
                ip: res.ip || '',
                timeZone: res.time_zone || '',
                request: {
                    sent: true,
                    done: true,
                    error: false,
                },
            };

            //console.log("IP STATUS",payload);

            return await dispatch('NEW_LOCALIZATION',{payload: payload});
        }
        catch(Exception){
            console.log("Promise Rejected",error);

            return await dispatch('NEW_LOCALIZATION_REQUEST_ERROR',{});
        };

    },

}