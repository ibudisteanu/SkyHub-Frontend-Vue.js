/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/6/2017.
 * (C) BIT TECHNOLOGIES
 */

import User from 'models/User/User.model';
import Vue from 'vue';

export default{

    SET_CONTENT_USER: (state, { user }) => {

        Vue.set(state.users, user.id, new User(user));

    },

}