/* eslint-disable import/prefer-default-export */

import * as UserProperties from './User.properties.js';
//var UserProperties = require ('./User.properties.ts');

export default class User {

    id;

    loggedIn;

    firstName;
    lastName;
    email;
    username;
    gender;

    profilePic;
    coverPic;

    preferredLang;
    connected ;
    timeZone;
    shortBio;

    longitude;
    latitude;

    role;

    country;
    city;

    dtCreation;
    dtLastActivity;


    constructor( data: Object = {}) {

        this.id = data.id||'';

        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';

        this.email = data.email || '';
        this.username = data.username || '';

        this.loggedIn = data.loggedIn || false;

        this.preferredLang = data.preferredLang || data.language || null;
        this.connected = data.connected || false;

        this.profilePic = data.profilePic || '';
        this.coverPic  = data.coverPic || '';

        this.country = data.country || '';
        this.city = data.city || '';
        this.dtCreation = data.dtCreation || Date.now();
        this.dtLastActivity = data.dtLastActivity || Date.now();

        this.gender = data.gender || '';

        this.role = data.role || UserProperties.UserRolesEnum.NOT_REGISTERED;

        this.timeZone = data.timeZone || 0;
        this.shortBio = data.shortBio || '';
        this.longitude = data.longitude || -666;
        this.latitude = data.latitude || -666;

        console.log('User assigned ', data, data.firstName, data.userName);


    }

    getName() {
        return this.firstName + ' ' + this.lastName;
    }

    isLoggedIn(){
        return this.loggedIn || false;
    }

    getProfilePic(){
      return this.profilePic;
    }

}
