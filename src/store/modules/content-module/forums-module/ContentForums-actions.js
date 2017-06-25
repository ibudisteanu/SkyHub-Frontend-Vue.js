/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'
import {calculateNewObjectsToBeAdded} from 'store/helpers/StoreHelper'

export default{


    /*
     THE FETCHING IS THE SAME...
     */

    CONTENT_FETCH_TOP_FORUMS: async ( {commit, state, dispatch}, {parent, pageIndex, pageCount}) =>{


        let answer = {result : false};

        answer = await FetchService.sendRequestGetData( "forums/get-top-forums",{parent: parent, pageIndex:pageIndex, pageCount: pageCount} );

        console.log("ANSWER TOP FORUMS", answer);

        if ((typeof answer !== "undefined")&&(answer.result === true)) {


            await commit('SET_CONTENT_FORUMS', {forums: answer.content});

            return  {result: true, forums: answer.content }
        }

        else
            return {result:false, forums: []}

    },


}