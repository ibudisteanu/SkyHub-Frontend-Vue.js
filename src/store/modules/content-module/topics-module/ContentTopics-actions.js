/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'

export default{

    CONTENT_FETCH_TOP_TOPICS: async ( {commit, state, dispatch}, {parent, pageIndex, pageCount, reset}) =>{

        if (reset === true) await commit('SET_CONTENT_TOPICS_CLEAR', {});

        let answer = {result : false};

        answer = await FetchService.sendRequestGetData( "content/get-top-content", {parent: parent, pageIndex:pageIndex, pageCount: pageCount} );

        if ((typeof answer !== "undefined")&&(answer.result === true)) {


            await commit('SET_CONTENT_TOPICS', {topics: answer.content});
            commit('SET_CONTENT_TOPICS_PAGE_INFORMATION',  {pageIndex: pageIndex, pageCount: pageCount} );

            return  {result: true, topics: answer.content }
        }

        else
            return {result:false, topics: []}

    },

}