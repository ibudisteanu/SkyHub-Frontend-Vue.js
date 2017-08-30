/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'

export default{

    CONTENT_ALL_PAGES_FETCH: async ( {commit, state, dispatch}, {parent, pageIndex, pageCount, reset}) =>{

        if (reset === true) await commit('SET_CONTENT_ALL_PAGES_RESET', {});

        let answer = await FetchService.sendRequestGetData( "pages/get-all-pages",{parent: parent, pageIndex:pageIndex, pageCount: pageCount} );

        //console.log('CONTENT_ALL_PAGES_FETCH',parent, pageIndex, pageCount, reset, answer);

        if ((typeof answer !== "undefined")&&(answer.result === true)) {

            await commit('SET_CONTENT_ALL_PAGES', {list: answer.list});
            commit('SET_CONTENT_ALL_PAGES_PAGE_INFORMATION',  {pageIndex: answer.newPageIndex-1, pageCount: pageCount, hasNext: answer.hasNext} );

            return  {result: true, pages: answer.list }
        }

        else
            return {result:false, pages: []}

    },


}