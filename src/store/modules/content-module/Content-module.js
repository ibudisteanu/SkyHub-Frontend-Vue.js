/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */


import actions from './Content-actions'
import mutations from './Content-mutations'
import getters from './Content-getters'

import ContentRouter from './router-module/ContentRouter-module';
import ContentAllPages from './all-pages-module/ContentAllPages-module';
import ContentUsers from './users-module/ContentUsers-module';

export default {
    modules: {
        contentRouter: ContentRouter,
        contentAllPages: ContentAllPages,

        contentUsers: ContentUsers,
    },
    state:  {

    },
    actions,
    mutations,
    getters
}

