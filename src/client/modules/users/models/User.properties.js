/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/16/2017.
 * (C) BIT TECHNOLOGIES
 */

/* eslint-disable import/prefer-default-export */

const UserGenderEnum = {
    MALE: 0,
    FEMALE: 1,
    NOT_SPECIFIED: 2,
}

const UserRolesEnum = {
    NOT_REGISTERED: 0,
    USER: 3,
    MODERATOR: 5,
    ADMIN: 8,
    SYS_ADMIN: 666,
}

module.exports = {

    UserGenderEnum: UserGenderEnum,
    UserRolesEnum : UserRolesEnum,

    convertGenderString (sGender){

        sGender = sGender.toLowerCase();

        switch (sGender){
            case 'male': return UserGenderEnum.MALE;
            case 'female': return UserGenderEnum.FEMALE;
            case 'not specified':
            default:
                return UserGenderEnum.NOT_SPECIFIED;
        }
    },

    convertRoleType (sUserRoleType){

        sUserRoleType = sUserRoleType.toLowerCase();

        switch (sUserRoleType){
            case 'user': return UserRolesEnum.USER;
            case 'admin':
            case 'administrator':
                return UserRolesEnum.ADMIN;
            case 'moderator': return UserRolesEnum.MODERATOR;
            case 'sys admin':
            case 'system admin':
                return UserRolesEnum.SYS_ADMIN;
            case 'not registered':
            case 'anonymous':
                return UserRolesEnum.NOT_REGISTERED;
            default:
                return UserRolesEnum.USER;
        }
    },

    getTimeZone : function (timeZone){
        return '';
    },

    getGenderString : function (gender){

        switch (gender){
            case UserGenderEnum.FEMALE: return 'female';
            case UserGenderEnum.MALE: return 'male';
            case UserGenderEnum.NOT_SPECIFIED:
            default: return 'not specified';
        }
    },

    getRoleString : function (role){

        switch (role){

            case UserRolesEnum.ADMIN: return 'admin';
            case UserRolesEnum.MODERATOR: return 'moderator';
            case UserRolesEnum.NOT_REGISTERED: return 'not registered';
            case UserRolesEnum.SYS_ADMIN: return 'system admin';
            case UserRolesEnum.USER: return 'user';
            default: return 'not specified';
        }
    }

}
