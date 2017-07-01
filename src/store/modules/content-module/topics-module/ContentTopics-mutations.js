/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vue from 'vue';
import ContentObjectService from 'store/helpers/ContentObject.service';

export default{

    //SET MULTIPLE FORUMS
    SET_CONTENT_TOPICS: (state, { topics }) => {

        for (let i=0; i<topics.length; i++)
            if (topics[i].object !== null){

                let topic = ContentObjectService.createObject(topics[i].object);

                Vue.set(state.topics, topic.parentId, topic );
            }
    },

    SET_CONTENT_TOPIC: (state, { topic }) => {

        Vue.set(state.topics, topic.parentId, topic);

    },

    SET_CONTENT_TOPICS_CLEAR : (state, { }) => {

        state.topics = {};

    },

    SET_CONTENT_TOPICS_PAGE_INFORMATION: (state, {  pageIndex, pageCount }) => {

        state.pageIndex = pageIndex;
        state.pageCount = pageCount;

    },

}