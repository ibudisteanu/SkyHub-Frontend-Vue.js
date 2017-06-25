/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'

export default{


    /*
     THE FETCHING IS THE SAME...
     */

    CONTENT_FETCH_TOP_FORUMS: async ( {commit, state, dispatch}, {parent, pageIndex, pageCount}) =>{


        let answer = {result : false};

        answer = await FetchService.sendRequestGetData( "forums/get-top-forums",{parent: parent, pageIndex:pageIndex, pageCount: pageCount} );

        console.log("ANSWER TOP FORUMS", answer);

        let toBeAdded = [];
        if ((typeof answer !== "undefined")&&(answer.result === true)) {

            toBeAdded = this.processNewContent(answer.content, this.contentState.contentForums.objects );

            if (toBeAdded !== [])
                await this.dispatch(setContentState_AddForumsObjects_Action(toBeAdded ));

        }
        return toBeAdded;



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