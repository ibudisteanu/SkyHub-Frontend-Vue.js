/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vuex from 'vuex'

import actions from './Localization-actions'
import mutations from './Localization-mutations'
import getters from './Localization-getters'

import User from 'models/User/User.model';

export default {
    state:  {
        country: '',
        countryCode: '',
        city: '',
        latitude: '',
        longitude: '',
        ip: '',
        timeZone: '',

        clientIP: '',

        request: {
            sent: false,
            done: false,
            error: false,
        }
    },
    actions,
    mutations,
    getters
}
