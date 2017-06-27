/* eslint-disable import/prefer-default-export */

//import UserProperties from './User.properties.js';
//var UserProperties = require ('./User.properties.js');

export default class Reply {

    constructor( data) {

        if (typeof data === "undefined") data = {};

        this.id = data.id||'';

        this.title = data.title || '';
        this.topicId = data.topicId || '';

        this.replyParentId = data.replyParentId || '';
        this.votingId = data.votingId || '';

        this.authorId = data.authorId || '';
        this.description = data.description || '';


        console.log('User assigned ', data, data.title, data.replyParentId);
    }



}