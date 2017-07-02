/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/1/2017.
 * (C) BIT TECHNOLOGIES
 */

import VoteType from './VoteType';

export default class Vote {

    constructor( data) {
        this.userId = data.userId || '';
        this.voteType = parseInt(data.voteType) || VoteType.VOTE_NONE;
    }

}