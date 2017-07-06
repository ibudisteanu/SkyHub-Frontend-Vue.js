/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/5/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'

export default{


    CONTENT_CURRENT_ROUTER_OBJECT_CHANGE_ICON: async ( {commit, state, dispatch}, {icon}) =>{

        FetchService.sendRequestGetData('content/set-icon', {id: state.object.id||'', icon: icon});

        return commit('SET_CURRENT_ROUTER_OBJECT_ICON', {icon: icon});

    },

    CONTENT_CURRENT_ROUTER_OBJECT_CHANGE_COVER: async ( {commit, state, dispatch}, {cover}) =>{

        FetchService.sendRequestGetData('content/set-cover', {id: state.object.id||'', cover: cover});

        return commit('SET_CURRENT_ROUTER_OBJECT_COVER', {cover: cover});

    },

}