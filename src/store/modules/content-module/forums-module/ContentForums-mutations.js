/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vue from 'vue';
import ContentObjectService from 'store/helpers/ContentObject.service';

export default{

    //SET MULTIPLE FORUMS
    SET_CONTENT_FORUMS: (state, { forums }) => {

        for (let i=0; i<forums.length; i++)
            if (forums[i].object !== null) {

                let forum = ContentObjectService.createObject(forums[i].object);

                Vue.set(state.forums, forum.id, forum);
            }
    },

    SET_CONTENT_FORUM: (state, { forum }) => {

        Vue.set(state.forums, forum.id, forum);

    },

    SET_CONTENT_FORUMS_CLEAR: (state, { }) => {
        state.forums = {};
    },


    SET_CONTENT_FORUMS_PAGE_INFORMATION: (state, {  pageIndex, pageCount }) => {

        state.pageIndex = pageIndex;
        state.pageCount = pageCount;

    },

}