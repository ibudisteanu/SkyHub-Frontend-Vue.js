/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

export default{



    CONTENT_FETCH_ROUTER_OBJECT: async ( {commit, store, dispatch}, {url}) =>{

        return dispatch('CONTENT_FETCH_ROUTER_OBJECT_TEMPLATE',{url, routerObjectTypeCommit: 'SET_CURRENT_ROUTER_OBJECT' })

    },

    CONTENT_FETCH_ROUTER_PARENT_OBJECT: async ( {commit, store, dispatch}, {url}) =>{

        return dispatch('CONTENT_FETCH_ROUTER_OBJECT_TEMPLATE',{url, routerObjectTypeCommit: 'SET_CURRENT_ROUTER_PARENT_OBJECT' })

    },

    /*
            THE FETCHING IS THE SAME...
     */

    CONTENT_FETCH_ROUTER_OBJECT_TEMPLATE: async ( {commit, store, dispatch}, {url, routerObjectTypeCommit}) =>{

        if ((typeof url === "undefined")||(url === '')) url = '/';

        if ( url === '/' ){
            await commit(routerObjectTypeCommit,{routerObject: null, notFound:false, url: '/'});
            return {result: true, object: null};
        }

        //extracting the data
        let routerObjectAnswer = await dispatch('CONTENT_FETCH_OBJECT',{url}); //getting the object
        let notFound = (routerObjectAnswer !== null);



        await commit(routerObjectTypeCommit, {routerObject: routerObjectAnswer.content, notFound: notFound});

        return {result: notFound, object: routerObjectAnswer.content};
    },


}