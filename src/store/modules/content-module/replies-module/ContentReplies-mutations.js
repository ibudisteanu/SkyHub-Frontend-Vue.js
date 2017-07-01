/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/29/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vue from 'vue';
import ContentObjectService from 'store/helpers/ContentObject.service';

export default{

    //SET MULTIPLE FORUMS
    SET_CONTENT_REPLIES: (state, { replies }) => {

        for (let i=0; i<replies.length; i++)
            if (replies[i].object !== null) {

                let reply = ContentObjectService.createObject(replies[i].object);

                Vue.set(state.replies, reply.id, reply );
            }
    },

    SET_CONTENT_REPLY: (state, { reply }) => {

        Vue.set(state.replies, reply.id, reply);

    },

    SET_CONTENT_REPLIES_CLEAR: (state, { }) => {
        state.replies = {};
    },


    SET_CONTENT_REPLIES_PAGE_INFORMATION: (state, {  pageIndex, pageCount }) => {

        state.pageIndex = pageIndex;
        state.pageCount = pageCount;

    },

}