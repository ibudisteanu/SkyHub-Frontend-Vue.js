/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */


import actions from './ContentRouter-actions'
import mutations from './ContentRouter-mutations'

export default {
    state:{
        currentRouterObject: false,
        pageURL: '',
        notFound: false,
        type: 'none',
    },

    actions,
    mutations,
}

