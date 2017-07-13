/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'

export default{

    CONTENT_FETCH_ROUTER_OBJECT_AND_CONTENT: async ({ commit, state, dispatch }, { url }) => {

        let res;
        res = await dispatch('CONTENT_FETCH_ROUTER_OBJECT', {url: url});

        console.log('##### CONTENT_FETCH_ROUTER_OBJECT', res);

        if ( res.result === true){

            let parent = ((typeof res.object !== "undefined") && (res.object !== null)) ? res.object.parent : '';
            let id =     ((typeof res.object !== "undefined") && (res.object !== null)) ? res.object.id : '';

            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% RESULT",id, parent);

            await dispatch('CONTENT_FETCH_ROUTER_PARENT_OBJECT', {url: parent} ); //fetching the parent object)

            switch (state.contentRouter.currentObject.type){
                case "home":
                case "forum":
                    await dispatch('CONTENT_FORUMS_FETCH_TOP',{parent: id,  pageIndex: 1, pageCount:8, reset:true, });
                    await dispatch('CONTENT_TOPICS_FETCH_TOP',{parent: id,  pageIndex: 1, pageCount:8, reset:true, });
                    break;
                case "topic":
                    await dispatch('CONTENT_REPLIES_FETCH_ALL',{parent: id, reset:true, });
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





    CONTENT_DELETE_OBJECT: async ( {commit, state, dispatch}, {objectId}) =>{
        try{

            if (objectId !== '') {
                let answer = await FetchService.sendRequestGetData('content/delete-object', {id: objectId}, objectId);

                console.log('------------------------- CONTENT DELETE OBJECT',answer);
                if (answer.result === true){
                    commit('SET_CONTENT_FORUM_DELETE',{id: objectId});
                    commit('SET_CONTENT_TOPIC_DELETE',{id: objectId});
                    commit('SET_CONTENT_REPLY_DELETE',{id: objectId});
                }

                return answer;
            }

        } catch (Exception){
            console.log("Exception deleting the reply", Exception);
            throw Exception;
        }
    },





    CONTENT_URL_SLUG: async ( {commit, store}, {parent, name}) => {
        return FetchService.sendRequestGetData("content/get-URL-slug", {parent:parent, name: name} );
    },

    CONTENT_URL_META: async ( {commit, store}, {link}) => {
        return FetchService.sendRequestGetData("meta-extractor/extract-url", {link:link});
    },


}