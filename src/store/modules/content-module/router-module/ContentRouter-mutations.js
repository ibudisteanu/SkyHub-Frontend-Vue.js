/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import ContentObjectService from 'store/helpers/ContentObject.service'

export default{

    SET_CURRENT_ROUTER_OBJECT: (state, { routerObject, notFound, url }) => {

        state.currentObject.object = ContentObjectService.createObject(routerObject);

        if (typeof url === 'undefined')
            if (state.currentObject.object  === null) url ='';
            else url = state.currentObject.object.URL||'';

        if (url === '/') state.currentObject.type = "home";
        else state.currentObject.type = ContentObjectService.extractObjectTypeFromId(routerObject);

        state.currentObject.pageURL = url;
        state.currentObject.notFound = notFound;
    },

    SET_CURRENT_ROUTER_PARAMS: (state, { pageIndex, pageType }) => {

        state.pageIndex = pageIndex;
        state.pageType = pageType;

    },

    SET_CURRENT_ROUTER_PARENT_OBJECT: (state, { routerObject, notFound, url }) => {

        state.parentObject.object = ContentObjectService.createObject(routerObject);

        if (url === '/') state.parentObject.type = "home";
        else state.parentObject.type = ContentObjectService.extractObjectTypeFromId(routerObject);

        state.parentObject.notFound = notFound;
    },

}