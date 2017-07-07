/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'

export default{

    CONTENT_FORUMS_FETCH_TOP: async ( {commit, state, dispatch}, {parent, pageIndex, pageCount, reset}) =>{

        if (reset === true) await commit('SET_CONTENT_FORUMS_RESET', {});

        let answer = await FetchService.sendRequestGetData( "forums/get-top-forums",{parent: parent, pageIndex:pageIndex, pageCount: pageCount} );

        //console.log('CONTENT_FORUMS_FETCH_TOP',parent, pageIndex, pageCount, reset, answer);

        if ((typeof answer !== "undefined")&&(answer.result === true)) {

            await commit('SET_CONTENT_FORUMS', {forums: answer.content});
            commit('SET_CONTENT_FORUMS_PAGE_INFORMATION',  {pageIndex: answer.newPageIndex-1, pageCount: pageCount, hasNext: answer.hasNext} );

            return  {result: true, forums: answer.content }
        }

        else
            return {result:false, forums: []}

    },

    CONTENT_FORUMS_FETCH_TOP_NEXT: async ( {commit, state, dispatch}, { parent }) =>{

        return dispatch('CONTENT_FORUMS_FETCH_TOP',{parent: parent, pageIndex: state.pageIndex+1, pageCount: state.pageCount, reset:false});

    },

    CONTENT_FORUMS_SUBMIT_ADD: async ( {commit, state, dispatch}, { parent, name, title, description,  keywords, country, language, city, latitude, longitude, timeZone }) =>{
        try{
            let resData = await FetchService.sendRequestGetData("forums/add-forum",{parent, name, title, description, keywords ,
                                                                                    country, language, city , latitude, longitude,  timeZone});


            console.log('Answer from FORUM ', resData);

            return resData;

        }
        catch(Exception)
        {
            console.log("Exception adding a new forum", Exception);
            throw Exception;
        }
    },


    CONTENT_FORUMS_GET: async ({commit, state, dispatch}, {id}) =>{

        //Using Promise
        return FetchService.sendRequestGetData("forums/get-forum",{id: id});

    }

}