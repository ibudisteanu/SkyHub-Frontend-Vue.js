/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/29/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'

export default{

    CONTENT_REPLIES_FETCH_TOP: async ( {commit, state, dispatch}, {parent, pageIndex, pageCount, reset}) =>{

        if (reset === true) await commit('SET_CONTENT_REPLIES_CLEAR', {});

        let answer = await FetchService.sendRequestWaitOnce( "replies/get-top-replies",{parent: parent, pageIndex:pageIndex, pageCount: pageCount} );

        if ((typeof answer !== "undefined")&&(answer.result === true)) {

            await commit('SET_CONTENT_REPLIES', {replies: answer.content});
            commit('SET_CONTENT_REPLIES_PAGE_INFORMATION',  {pageIndex: pageIndex, pageCount: pageCount} );

            return  {result: true, replies: answer.content }
        }
        else
            return {result:false, replies: []}

    },

    CONTENT_REPLIES_FETCH_ALL: async ( {commit, state, dispatch}, {parent, reset}) =>{

        if (reset === true) await commit('SET_CONTENT_REPLIES_CLEAR', {});

        let answer = await FetchService.sendRequestWaitOnce( "replies/get-all-replies",{parent: parent} );

        console.log("@@@@@@@@@ REPLIES answer",answer);

        if ((typeof answer !== "undefined")&&(answer.result === true)) {
            await commit('SET_CONTENT_REPLIES', {replies: answer.content});
            return  {result: true, replies: answer.content }
        } else
            return {result:false, replies: []}

    },

    CONTENT_REPLIES_SUBMIT_ADD: async ( {commit, state, dispatch}, {parent, parentReply, title, description,  attachments, keywords, country, language, city, latitude, longitude}) =>{
        try{
            let resData = await FetchService.sendRequestWaitOnce("replies/add-reply",{parent : parent, parentReply:parentReply, title: title, description: description,  attachments: attachments,
                                                                                     keywords : keywords,  country: country, language:language, city : city,
                                                                                     latitude: latitude, longitude : longitude});


            console.log('Answer from REPLY ', resData);

            if (resData.result === true){
                commit('SET_CONTENT_REPLY', { reply : resData.reply });
            }

            return resData;

        }
        catch(Exception)
        {
            console.log("Exception adding a new reply", Exception);
            throw Exception;
        }
    },

    CONTENT_REPLIES_GET: async ({commit, state, dispatch}, {id}) =>{

        //Using Promise
        return FetchService.sendRequestWaitOnce("forums/get-forum",{id: id});

    }

}