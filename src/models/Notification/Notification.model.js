/* eslint-disable import/prefer-default-export */

import UserModel from 'models/User/User.model'

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

        if (typeof data.shown === 'undefined') this.shown = false;
        else this.shown = data.shown;

        if (typeof data.read === 'undefined') this.read = false;
        else this.read = data.read;

        this.params = data.params || {};

    }

    getUsersInvolved(){
        let list = [];

        if ((this.params.userSourceId||'') !== ''){
            list.push(this.params.userSourceId);
        }

        return list;
    }




}
