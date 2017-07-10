/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'

export default{

    CONTENT_TOPICS_FETCH_TOP: async ( {commit, state, dispatch}, {parent, pageIndex, pageCount, reset}) =>{

        if (reset === true) await commit('SET_CONTENT_TOPICS_RESET', {});

        //  pageCount = 2;

        let answer = await FetchService.sendRequestGetData( "content/get-top-content", {parent: parent, pageIndex:pageIndex, pageCount: pageCount } );

        console.log('CONTENT_TOPICS_FETCH_TOP',parent, pageIndex, pageCount, reset, answer);

        if ((typeof answer !== "undefined")&&(answer.result === true)) {

            //console.log('@@@@@@@@@@@ TOPICS FETCH TOP ',answer);

            await commit('SET_CONTENT_TOPICS', {topics: answer.content});
            commit('SET_CONTENT_TOPICS_PAGE_INFORMATION',  {pageIndex: answer.newPageIndex-1, pageCount: pageCount, hasNext: answer.hasNext} );

            for (let i=0; i<answer.content.length; i++){
                //console.log('####### CONTENT_REPLIES_FETCH_TOP',answer.content[i].id);
                await dispatch('CONTENT_REPLIES_FETCH_TOP',{parent: answer.content[i].object.id, pageIndex:1, pageCount:3, reset:false, });
            }

            return  {result: true, topics: answer.content }
        }

        else
            return {result:false, topics: []}

    },

    CONTENT_TOPICS_FETCH_TOP_NEXT:  ( {commit, state, dispatch}, {parent}) =>{

        return dispatch('CONTENT_TOPICS_FETCH_TOP',{parent: parent, pageIndex: state.pageIndex+1, pageCount: state.pageCount, reset:false});

    },

    CONTENT_TOPICS_SUBMIT_ADD: async ({commit, state, dispatch}, {parentId, title,  image, description, attachments, keywords, countryCode, language, city, latitude, longitude}) =>{

        try {

            //Using Promise
            let resData = await FetchService.sendRequestGetData("topics/add-topic",{parent : parentId, title: title, image:image, description: description,  attachments: attachments,
                                                                                    keywords : keywords,  country: countryCode, language:language, city : city,
                                                                                    latitude: latitude, longitude : longitude});

            console.log('Answer from TOPIC ', resData);

            return resData;

        }
        catch (Exception){
            console.log("Exception adding a new topic",Exception);
            throw Exception;
        }

    },

    CONTENT_TOPICS_GET: async ({commit, state, dispatch}, {id}) =>{

        //Using Promise
        return FetchService.sendRequestGetData("topics/get-topic",{id: id});

    }

}