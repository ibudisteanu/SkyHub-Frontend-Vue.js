/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'

export default{



    CONTENT_FETCH_OBJECT: async ( {commit, store}, {sContentToSearchId}) => {

        if (sContentToSearchId !== '')
            return await FetchService.sendRequestGetData('content/get-content', {id: sContentToSearchId});
        else
            return {result: false, data: {content: null}};
    },











    CONTENT_URL_SLUG: async ( {commit, store}, {parent, name}) => {
        return FetchService.sendRequestGetData("content/get-URL-slug", {parent:parent, name: name} );
    },

    CONTENT_URL_META: async ( {commit, store}, {parent, name}) => {
        return FetchService.sendRequestGetData("meta-extractor/extract-url", {link:link});
    },


}