/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import ContentObjectService from 'services/REST/forums/content/ContentObject.service'

export default{

    SET_CURRENT_ROUTER_OBJECT: (state, { routerObject, notFound, url }) => {
        state.currentRouterObject = ContentObjectService.createObject(routerObject);
        state.type = ContentObjectService.extractObjectTypeFromId(routerObject);
        state.pageURL = url;
        state.notFound = notFound;
    },

}