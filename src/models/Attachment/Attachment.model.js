/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/29/2017.
 * (C) BIT TECHNOLOGIES
 */

export default class Attachment {

    constructor( data ) {

    }


    static getLinkAttachment(Topic){
        for (let i=0; i<Topic.arrAttachments.length; i++)
            if (Topic.arrAttachments[i].type === "link"){
                return Topic.arrAttachments[i];
            }

        return null;
    }

}