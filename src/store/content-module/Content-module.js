/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */


import actions from './Content-actions'
import mutations from './Content-mutations'
import getters from './Content-getters'

import ContentRouter from './router-module/ContentRouter-module';

export default {
    modules: {
        contentRouter: ContentRouter,
    },
    state:  {

    },
    actions,
    mutations,
    getters
}

