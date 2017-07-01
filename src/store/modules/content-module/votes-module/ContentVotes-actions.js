/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/1/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'

export default{



    CONTENT_VOTES_SUBMIT_VOTE: async ({commit, state, dispatch}, {parentId, voteType}) =>{

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

    CONTENT_VOTES_FETCH: async ({commit, state, dispatch}, {parentId }) =>{

        if (typeof state.votes.parentId !== 'undefined') return {result: true, vote: state.votes.parentId }; //already fetched previously...

        let result  = await FetchService.sendRequestGetData("voting/get-vote",{parentId: parentId});

        if (result.result === true){

            console.log('CONTENT_VOTES_FETCH answer', result);
            await commit('SET_CONTENT_VOTE', {vote: result.vote});

        }

        return result;

    }

}