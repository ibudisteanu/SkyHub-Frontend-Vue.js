/* eslint-disable import/prefer-default-export */

//import UserProperties from './User.properties.js';
//var UserProperties = require ('./User.properties.js');

export default class User {

    constructor( data) {

        if (typeof data === "undefined") data = {};

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

        this.age = data.age || 0;

        this.isOwner = data.isOwner || false;

        this.country = data.country || '';
        this.city = data.city || '';
        this.dtCreation = data.dtCreation || Date.now();
        this.dtLastActivity = data.dtLastActivity || Date.now();

        this.gender = data.gender || 0;

        //this.role = data.role || UserProperties.UserRolesEnum.NOT_REGISTERED;

        this.timeZone = data.timeZone || 0;
        this.shortBio = data.shortBio || '';
        this.longitude = data.longitude || -666;
        this.latitude = data.latitude || -666;

        //console.log('User assigned ', data, data.firstName, data.username);
    }

    static getName(User) {
        return User.firstName + ' ' + User.lastName;
    }

    static isLoggedIn(User){
        return User.loggedIn || false;
    }

    static getProfilePic(User){

        return User.profilePic||'';

    }

}