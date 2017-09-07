/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/29/2017.
 * (C) BIT TECHNOLOGIES
 */

export default class Attachments {

    static getLinkAttachment(object){


        if ((typeof object === 'object') || (Array.isArray(object.attachments)))
            for (let i=0; i<object.attachments.length; i++)
                if (object.attachments[i].type === "link"){
                    return object.attachments[i];
                }

        return null;
    }


    static getTitle(object){
        if (object.title !== '') return object.title;
        if (Attachments.getLinkAttachment(object) !== null) return Attachments.getLinkAttachment(object).title;
        if (object.attachments.length > 0 ) return object.attachments[0].title||'';

        return '';
    }

    static getDescription(object){
        if (object.description !== '') return object.description;
        if (Attachments.getLinkAttachment(object) !== null) return Attachments.getLinkAttachment(object).description;
        if (object.attachments.length > 0 ) return object.attachments[0].description||'';

        return '';
    }

    static getShortDescription(object){
        if (object.shortDescription !== '') return object.shortDescription;
        if (Attachments.getLinkAttachment(object) !== null) return Attachments.getLinkAttachment(object).description;
        if (object.attachments.length > 0 ) return object.attachments[0].description||'';

        return '';
    }

    static getImage(object){
        if (typeof object.image !== "undefined"){

            if (typeof object.image === "string") return {url:object.image, alt:'', img:object.image};
            else
            if ((typeof object.image ==="object") && (object.image !== null)) return object;
        }


        if (object.attachments.length > 0 ) //I have an uploaded image
            for (let i=0; i<object.attachments.length; i++)
                if ((object.attachments[i].type === "file")&&(object.attachments[i].typeFile.indexOf("image") >= 0 ))
                    return object.attachments[0];

        if (Attachments.getLinkAttachment(object) !== null) return Attachments.getLinkAttachment(object).img;

        return {url:'', alt:'', img:''};
    }

    static getKeywords(object){
        if ((typeof object.keywords !== "undefined")&&(object.keywords !== '')) return object.keywords;
        if (Attachments.getLinkAttachment(object) !== null) return Attachments.getLinkAttachment(object).keywords;
        if (object.attachments.length > 0 ) return Attachments.attachments[0].keywords;

        return '';
    }


}