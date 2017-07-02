/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/1/2017.
 * (C) BIT TECHNOLOGIES
 */

import Vue from 'vue';
import Voting from 'models/Vote/Voting.model'

export default{

    //SET MULTIPLE FORUMS
    SET_CONTENT_VOTES: (state, { votes }) => {

        for (let i=0; i<votes.length; i++)
            if (votes[i].object !== null){

                let voting = new Voting(votes[i].object);

                Vue.set(state.votings, voting.parentId, voting );
            }
    },

    SET_CONTENT_VOTE: (state, { vote }) => {

        Vue.set(state.votes, vote.parentId, new Voting(vote) );

    },

    SET_CONTENT_VOTE_LOADING_STATUS : (state, { parentId, loadingStatus }) => {

        state.votes[parentId].loading = loadingStatus;

    },

    SET_CONTENT_VOTE_ALL_VOTES : (state, { vote }) => {

        vote.votesAllLoaded = true; // marking the fact that the all the votes had been shown
        Vue.set(state.votes, vote.parentId, new Voting(vote));

    },

    SET_CONTENT_VOTES_CLEAR : (state, { }) => {

        state.votes = {};

    },

}