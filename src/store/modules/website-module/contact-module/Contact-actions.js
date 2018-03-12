/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'

export default{

    CONTACT_SEND_EMAIL: async ({ commit, state, dispatch }, { parentId, name, emailAddress, authorId,  title, body,  country, language,  city, latitude, longitude, timezone}) => {

        if (sContentToSearchId !== '')
            return await FetchService.sendRequestWaitOnce('contact/send-email-content', {id: sContentToSearchId});

        let res;
        res = await dispatch('CONTENT_FETCH_ROUTER_OBJECT', {url: url});

        console.log('##### CONTENT_FETCH_ROUTER_OBJECT', url, res);

        if  ( res.result === true){

            let parent = ((typeof res.object !== "undefined") && (res.object !== null)) ? res.object.parent||res.object.parentId : '';
            let id =     ((typeof res.object !== "undefined") && (res.object !== null)) ? res.object.id : '';

            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% RESULT",id, parent, state.contentRouter.currentObject.type);

            await dispatch('CONTENT_FETCH_ROUTER_PARENT_OBJECT', {url: parent} ); //fetching the parent object)

            switch (state.contentRouter.currentObject.type){
                case "home":
                case "forum":
                    if (pageType === 'pages'){

                        await dispatch('CONTENT_ALL_PAGES_FETCH', {parent: id,  pageIndex: Math.max(pageIndex,1), pageCount:25, reset: true, });

                    } else {
                        await dispatch('CONTENT_FORUMS_FETCH_TOP',{parent: id,  pageIndex: ((pageIndex > 0 && pageType==='forums') ? pageIndex : 1), pageCount:8, reset: (typeof window === 'undefined')||(pageIndex===0), });
                        await dispatch('CONTENT_TOPICS_FETCH_TOP',{parent: id,  pageIndex: ((pageIndex > 0 && pageType==='') ? pageIndex : 1), pageCount:8, reset: (typeof window === 'undefined')||(pageIndex===0), });
                    }
                    break;
                case "topic":
                    await dispatch('CONTENT_REPLIES_FETCH_ALL',{parent: id, reset:true, });
                    break;
            }

        }
    },


}