/* eslint-disable import/prefer-default-export */


export default class Notification {


    // id = '';
    // dtCreation = 0;
    // authorId = '';
    // params: {}; //params is a JSON object that contains objects

    constructor( data) {

        if (typeof data === "undefined") data = {};

        this.id = data.id||'';
        this.dtCreation = data.dtCreation || '';
        this.authorId = data.authorId || '';
        this.template = data.template || '';
        this.params = data.params || {};

    }


    isLoggedIn(){
        return this.loggedIn || false;
    }




}
