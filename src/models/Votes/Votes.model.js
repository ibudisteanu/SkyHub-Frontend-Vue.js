/* eslint-disable import/prefer-default-export */

//import UserProperties from './User.properties.js';
//var UserProperties = require ('./User.properties.js');

export default class Votes {


    constructor( data) {

        if (typeof data === "undefined") data = {};

             this.id = data.id||'';
        this.parentId = data.parentId || '';
        this.value = data.value || '';

        this.votings = {userId: data.userId || '', votingType: data.votingType || '' };



    }


}