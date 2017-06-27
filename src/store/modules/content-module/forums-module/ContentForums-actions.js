/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'

export default{

    CONTENT_FETCH_TOP_FORUMS: async ( {commit, state, dispatch}, {parent, pageIndex, pageCount, reset}) =>{

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


    CONTENT_FORUMS_ADD: async ( {commit, state, dispatch}, {parent, name, title, description,  keywords, country, language, city, latitude, longitude, timeZone}) =>{
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


    CONTENT_FORUMS_GET(sId){

        //Using Promise
        return FetchService.sendRequestGetData("forums/get-forum",{id: sId});

    }

}