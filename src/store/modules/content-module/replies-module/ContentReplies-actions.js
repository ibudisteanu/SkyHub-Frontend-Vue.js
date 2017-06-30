/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/29/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'

export default{

    CONTENT_REPLIES_FETCH_TOP: async ( {commit, state, dispatch}, {parent, pageIndex, pageCount, reset}) =>{

        if (reset === true) await commit('SET_CONTENT_FORUMS_CLEAR', {});

        let answer = {result : false};

        answer = await FetchService.sendRequestGetData( "forums/get-top-forums",{parent: parent, pageIndex:pageIndex, pageCount: pageCount} );

        if ((typeof answer !== "undefined")&&(answer.result === true)) {


            await commit('SET_CONTENT_FORUMS', {forums: answer.content});
            commit('SET_CONTENT_FORUMS_PAGE_INFORMATION',  {pageIndex: pageIndex, pageCount: pageCount} );

            return  {result: true, forums: answer.content }
        }

        else
            return {result:false, forums: []}

    },


    CONTENT_REPLIES_SUBMIT_ADD: async ( {commit, state, dispatch}, {parent, parentReply, title, description,  attachments, keywords, country, language, city, latitude, longitude}) =>{
        try{
            let resData = await FetchService.sendRequestGetData("replies/add-reply",{parent : parent, parentReply:parentReply, title: title, description: description,  attachments: attachments,
                                                                                    keywords : keywords,  country: country, language:language, city : city,
                                                                                    latitude: latitude, longitude : longitude});


            console.log('Answer from REPLY ', resData);

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
        return FetchService.sendRequestGetData("forums/get-forum",{id: id});

    }

}