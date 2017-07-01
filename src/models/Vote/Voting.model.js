
import Vote from './Vote.model';

const VoteType = {
    VOTE_UP: 1,
    VOTE_DOWN: -1,
    VOTE_NONE: 666,
};

export default class Voting {

    /*
        VOTES = array of Vote

     */


    constructor( data) {

        if (typeof data === "undefined") data = {};

        this.id = data.id||'';
        this.parentId = data.parentId || '';
        this.value = data.value || '';

        this.votes = [];

        let votes = data.votes || [];
        for (let i=0; i<votes.length; i++)
            this.votes.push( new Vote(votes[i]) );

    }

    static voteExists( Voting, authorId){

        for (let i=0; i<Voting.votes.length; i++)
            if (Voting.votes[i].userId === authorId){
                return i;
            }

        return null;
    }

    static addVote( Voting, authorId, voteType ){

        if ((authorId === null)||(authorId === ''))
            return {result:false, message: 'You need to be logged in'};

        let voteIndex = this.voteExists(Voting, authorId);

        if (voteIndex !== null){

            if (voteType === this.votes[voteIndex].voteType)
                return {result: false, message: 'You can not vote multiple times'};

            this.votes[voteIndex].voteType =  voteType;
            return {result : true};
        }

        this.votes.push(new Vote({userId: authorId, voteType: voteType}));
        return {result : true};
    }

    static removeVote ( Voting ){



    }


}