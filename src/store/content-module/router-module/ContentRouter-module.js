/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */


import actions from './ContentRouter-actions'
import mutations from './ContentRouter-mutations'

import ContentRouterObject from './current-router-object-module/ContentRouter-module';
import ParentRouterObject from './parent-router-object-module/ParentRouter-module';

export default {

    modules:{
        routerObject: ContentRouterObject,
        routerParentObject: ParentRouterObject,
    },

    state:{

    },


    actions,
    mutations,
}

