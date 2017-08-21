
/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */


import Vue from 'vue'

export default {

    SET_LOCALIZATION_IP: (state, {ip}) => {
        if (ip.lastIndexOf(":") > -1){
            ip = ip.substr(ip.lastIndexOf(":")+1);
        }
        state.ip = ip;
    },

    SET_LOCALIZATION_DATA: (state, {payload}) => {
        state.country = payload.country;
        state.countryCode = payload.countryCode;
        state.city = payload.city;
        state.latitude = payload.latitude;
        state.longtitude = payload.longitude;
        state.timeZone = payload.timeZone;
        state.request = payload.request;
        state.clientIP = payload.clientIP;
    },

    SET_LOCALIZATION_REQUEST_ERROR: (state, {}) => {
        state.request = {
            sent: true,
            done: false,
            error: true,
        };
    },

}