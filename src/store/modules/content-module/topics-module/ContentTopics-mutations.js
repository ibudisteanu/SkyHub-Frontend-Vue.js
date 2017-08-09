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

                Vue.set(state.topics, topic.id, topic );
            }
    },

    SET_CONTENT_TOPIC: (state, { topic }) => {
        topic = ContentObjectService.createObject(topic);
        Vue.set(state.topics, topic.id, topic);
    },

    SET_CONTENT_TOPIC_DELETE: (state, { id }) => {
        Vue.delete(state.topics, id);
    },

    SET_CONTENT_TOPICS_CLEAR : (state, { }) => {
        state.topics = {};
    },

    SET_CONTENT_TOPICS_RESET : (state, { }) => {
        state.topics = {};
        state.hasNext = true;
    },


    SET_CONTENT_TOPICS_PAGE_INFORMATION: (state, {  pageIndex, pageCount, hasNext }) => {

        state.pageIndex = pageIndex;
        state.pageCount = pageCount;
        state.hasNext = hasNext;

    },

}