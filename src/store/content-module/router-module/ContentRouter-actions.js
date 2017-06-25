/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

export default{

    CONTENT_FETCH_ROUTER_OBJECT_AND_CONTENT: async ({ commit, store, dispatch }, { url }) => {

        await dispatch('CONTENT_FETCH_ROUTER_OBJECT', {url});

    },

    CONTENT_FETCH_ROUTER_OBJECT: async ( {commit, store, dispatch}, {url}) =>{

        if (typeof url === "undefined") url = '/';

        if ( url === '/' ){
            return await commit('SET_CURRENT_ROUTER_OBJECT',{routerObject: null, notFound:false, url: '/'});
        }

        let routerObjectAnswer = await dispatch('CONTENT_FETCH_OBJECT',{url}); //getting the object
        return await commit('SET_CURRENT_ROUTER_OBJECT', {routerObject: routerObjectAnswer, notFound: (routerObjectAnswer !== null), url: url });

    },


}