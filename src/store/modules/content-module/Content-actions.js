/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'

export default{

    CONTENT_FETCH_ROUTER_OBJECT_AND_CONTENT: async ({ commit, state, dispatch }, { url }) => {

        let res;
        res = await dispatch('CONTENT_FETCH_ROUTER_OBJECT', {url: url});

        if ( res.result === true){

            let parent = ((typeof res.object !== "undefined") && (res.object !== null)) ? res.object.parent : '';
            let id =     ((typeof res.object !== "undefined") && (res.object !== null)) ? res.object.id : '';

            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% RESULT",id, parent);

            await dispatch('CONTENT_FETCH_ROUTER_PARENT_OBJECT', {url: parent} ); //fetching the parent object)

            switch (state.contentRouter.routerObject.type){
                case "home":
                case "forum":
                    await dispatch('CONTENT_FORUMS_FETCH_TOP',{parent: id,  pageIndex: 1, pageCount:8, reset:true, });
                    await dispatch('CONTENT_TOPICS_FETCH_TOP',{parent: id,  pageIndex: 1, pageCount:8, reset:true, });
                    break;
                case "topic":
                    //await this.fetchTopReplies(sContentToSearchId, 1, 8);
                    break;
            }

        }
    },



    CONTENT_FETCH_OBJECT: async ( {commit, store}, {sContentToSearchId}) => {

        console.log("CONTENT_FETCH_ROUTER_OBJECT_AND_CONTENT", {url: sContentToSearchId});

        if (sContentToSearchId !== '')
            return await FetchService.sendRequestGetData('content/get-content', {id: sContentToSearchId});
        else
            return {result: false, data: {content: null}};
    },











    CONTENT_URL_SLUG: async ( {commit, store}, {parent, name}) => {
        return FetchService.sendRequestGetData("content/get-URL-slug", {parent:parent, name: name} );
    },

    CONTENT_URL_META: async ( {commit, store}, {link}) => {
        return FetchService.sendRequestGetData("meta-extractor/extract-url", {link:link});
    },


}