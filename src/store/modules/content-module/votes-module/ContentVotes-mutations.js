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

                Vue.set(state.votings, voting.id, voting );
            }
    },

    SET_CONTENT_VOTE: (state, { vote }) => {

        Vue.set(state.votes, vote.id, vote);

    },

    SET_CONTENT_VOTES_CLEAR : (state, { }) => {

        state.votes = {};

    },

}