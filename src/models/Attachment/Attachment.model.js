/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/29/2017.
 * (C) BIT TECHNOLOGIES
 */

export default class Attachment {

    constructor( data ) {

        this.type = data.type||'';
        this.typeFile = data.typeFile||'';

        this.img = data.img||'';
        this.description = data.description||'';
        this.title = data.title||'';
        this.url = data.url||'';


    }

}