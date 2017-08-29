/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

export default{



    CONTENT_FETCH_ROUTER_OBJECT: async ( {commit, store, dispatch}, {url}) =>{

        return dispatch('CONTENT_FETCH_ROUTER_OBJECT_TEMPLATE',{ url: url, routerObjectTypeCommit: 'SET_CURRENT_ROUTER_OBJECT' })

    },

    CONTENT_FETCH_ROUTER_PARENT_OBJECT: async ( {commit, store, dispatch}, {url}) =>{

        return dispatch('CONTENT_FETCH_ROUTER_OBJECT_TEMPLATE',{url, routerObjectTypeCommit: 'SET_CURRENT_ROUTER_PARENT_OBJECT' })

    },

    CONTENT_SET_CURRENT_ROUTER_PARAMS: async ( {commit, store, dispatch}, { pageIndex, pageType}) =>{

        return commit('SET_CURRENT_ROUTER_PARAMS', {pageIndex, pageType});

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
        let answer = await dispatch('CONTENT_FETCH_OBJECT',{sContentToSearchId: url}); //getting the object

        if (answer.result){
            let notFound = (answer.content === null);
            await commit(routerObjectTypeCommit, {routerObject: answer.content, notFound: notFound});
            return {result: !notFound, object: answer.content};
        } else {
            await commit(routerObjectTypeCommit, {routerObject: null, notFound: true});
            return {result: false, object: null};
        }
    },


}