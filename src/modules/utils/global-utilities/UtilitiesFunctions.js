/**
 * Created by ionut on 13.07.2017.
 */

import UserProperties from 'models/User/User.properties';

export function checkOwner(User, Object ){

    if ((typeof User === 'undefined')||(User === null)) return false;
    if ((typeof Object === 'undefined')||(Object === null)) return false;

    //console.log('----------------------- checkOwner ',User.id, User.role, Object.authorId);

    if (Object.authorId === User.id)
        return true;

    if ((User.role === UserProperties.UserRolesEnum.SYS_ADMIN)||(User.role === UserProperties.UserRolesEnum.ADMIN)){
        return true;
    }

    return false;
}
