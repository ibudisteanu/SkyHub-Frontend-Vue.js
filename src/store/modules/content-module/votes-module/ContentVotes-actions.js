/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/1/2017.
 * (C) BIT TECHNOLOGIES
 */

import FetchService from 'services/communication/FetchService'
import Voting from 'models/Vote/Voting.model';

export default{



    CONTENT_VOTES_SUBMIT_VOTE: async ({commit, state, dispatch}, {parentId, userId, voteType}) =>{

        try {

            await commit('SET_CONTENT_VOTE_LOADING_STATUS',{parentId: parentId, loadingStatus: true});

            let resData = await FetchService.sendRequestGetData("voting/submit-vote",{parentId: parentId, voteType: voteType }, parentId);
            console.log('Answer from Votings ', resData);

            await commit('SET_CONTENT_VOTE_LOADING_STATUS',{parentId: parentId, loadingStatus: false});

            if (resData.result){
                Voting.addVote( state.votes[parentId], userId, voteType );
            }

            return resData;

        }
        catch (Exception){
            console.log("Exception submitting the voting",Exception);
            throw Exception;
        }

    },

    CONTENT_VOTES_FETCH: async ({commit, state, dispatch}, {parentId }) =>{

        if (typeof state.votes.parentId !== 'undefined') return {result: true, vote: state.votes.parentId }; //already fetched previously...

        let result  = await FetchService.sendRequestGetData("voting/get-vote", {parentId: parentId}, parentId);

        if (result.result === true){

            await commit('SET_CONTENT_VOTE', {vote: result.vote});

        }

        return result;

    },

    CONTENT_VOTES_FETCH_ALL_VOTES: async ({commit, state, dispatch}, {parentId }) =>{

        let result  = await FetchService.sendRequestGetData("voting/get-all-votes", {parentId: parentId}, parentId);

        if (result.result === true){

            console.log('CONTENT_VOTES_FETCH_ALL_VOTES answer', result);
            await commit('SET_CONTENT_VOTE_ALL_VOTES', {vote: result.vote});

        }

        return result;

    }

}