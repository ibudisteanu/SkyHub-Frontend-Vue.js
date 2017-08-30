/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vue from 'vue';

export default{

    //SET MULTIPLE FORUMS
    SET_CONTENT_ALL_PAGES: (state, { list }) => {

        for (let i=0; i<list.length; i++)
            if (list[i].page !== null) {

                let page = list[i];

                Vue.set(state.allPages, page.id, page.page);
            }
    },

    SET_CONTENT_ALL_PAGE: (state, { id, page }) => {
        Vue.set(state.allPages, id, page);
    },

    SET_CONTENT_ALL_PAGES_DELETE: (state, { id }) => {
        Vue.delete(state.allPages, id);
    },

    SET_CONTENT_ALL_PAGES_CLEAR: (state, { }) => {
        state.allPages = {};
    },

    SET_CONTENT_ALL_PAGES_RESET: (state, { }) => {
        state.hasNext = true;
        state.allPages = {};
    },


    SET_CONTENT_ALL_PAGES_PAGE_INFORMATION: (state, {  pageIndex, pageCount, hasNext }) => {

        state.pageIndex = pageIndex;
        state.pageCount = pageCount;
        state.hasNext = hasNext;

    },

}