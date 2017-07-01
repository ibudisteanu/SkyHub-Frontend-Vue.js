/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/1/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'

export default{



    CONTENT_VOTINGS_SUBMIT_VOTE: async ({commit, state, dispatch}, {parentId, voteType}) =>{

        try {

            //Using Promise
            let resData = await FetchService.sendRequestGetData("voting/submit-vote",{parentId: parentId, voteType: voteType });

            console.log('Answer from Votings ', resData);

            return resData;

        }
        catch (Exception){
            console.log("Exception submitting the voting",Exception);
            throw Exception;
        }

    },

    CONTENT_VOTINGS_FETCH: async ({commit, state, dispatch}, {id}) =>{

        //Using Promise
        return FetchService.sendRequestGetData("topics/get-topic",{id: id});

    }

}