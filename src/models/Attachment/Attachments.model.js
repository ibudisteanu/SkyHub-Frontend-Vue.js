/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/29/2017.
 * (C) BIT TECHNOLOGIES
 */

export default class Attachments {

    static getLinkAttachment(object){
        for (let i=0; i<object.attachments.length; i++)
            if (object.attachments[i].type === "link"){
                return object.attachments[i];
            }

        return null;
    }

}