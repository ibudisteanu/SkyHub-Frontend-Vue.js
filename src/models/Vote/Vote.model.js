/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/1/2017.
 * (C) BIT TECHNOLOGIES
 */

export default class Vote {

    constructor( data) {
        this.userId = data.userId || '';
        this.voteType = data.voteType || '';
    }

}