/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/23/2017.
 * (C) BIT TECHNOLOGIES
 */

import User from 'models/User/User.model'

export default {

    isUserLoggedIn (state) {

        return User.isLoggedIn(state.user);

    }

}

