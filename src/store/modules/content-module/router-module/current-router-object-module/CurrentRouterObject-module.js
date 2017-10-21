/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import actions from './CurrentRouterObject-actions'
import mutations from './CurrentRouterObject-mutations'

export default {

    state:{
            object: null,
            pageURL: '',
            notFound: false,
            type: 'home',
        },

    actions,
    mutations,

}

