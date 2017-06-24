/* eslint-disable import/prefer-default-export */

import * as UserProperties from '../User/User.properties.js';
//var UserProperties = require ('./User.properties.ts');

export default class Notification {


    constructor( data) {

      if (typeof data === "undefined") data = {};

      this.id = data.id||'';
      this.dtCreation = data.dtCreation || '';
      this.description = data.description || '';
      this.template = data.template || '';
      this.title = data.title || '';
      this.destinationId = data.destinationId || '';
      this.senderId = data.sender || '';
      this.body = data.body || '';

    }


    isLoggedIn(){
        return this.loggedIn || false;
    }




}
