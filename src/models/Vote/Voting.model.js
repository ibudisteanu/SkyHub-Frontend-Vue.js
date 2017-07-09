
import Vote from './Vote.model';
import VoteType from './VoteType';

export default class Voting {

    /*
        VOTES = array of Vote

     */


    constructor( data) {

        if (typeof data === "undefined") data = {};

        this.parentId = data.parentId || '';

        if (typeof data.ups === 'undefined') this.ups = 0;
        else this.ups = parseInt(data.value);

        if (typeof data.downs === 'undefined') this.downs = 0;
        else this.downs = parseInt(data.value);

        this.votes = [];
        this.loading = false;

        if (typeof data.votesAllLoaded === 'undefined') this.votesAllLoaded = false;
        else this.votesAllLoaded = data.votesAllLoaded;

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

            console.log('addVote', Voting, Voting.votes, authorId, voteIndex, voteType, Voting.votes[voteIndex].voteType);

            if (voteType === Voting.votes[voteIndex].voteType)
                return {result: false, message: 'You can not vote multiple times'};

            if (Voting.votes[voteIndex].voteType !== VoteType.VOTE_NONE)
                Voting.value -= Voting.votes[voteIndex].voteType;

            Voting.votes[voteIndex].voteType =  voteType;

            Voting.value += voteType;
            return {result : true};
        }

        Voting.votes.push(new Vote({userId: authorId, voteType: voteType}));
        Voting.value += voteType;
        return {result : true};
    }

    static removeVote ( Voting ){



    }


}