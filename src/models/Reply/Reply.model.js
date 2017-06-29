/* eslint-disable import/prefer-default-export */

//import UserProperties from './User.properties.js';
//var UserProperties = require ('./User.properties.js');

export default class Reply {

    constructor( data) {

        if (typeof data === "undefined") data = {};

        this.id = data.id||'';

        this.title = data.title || '';
        this.topicId = data.topicId || '';

        this.replyParentId = data.replyParentId || '';
        this.votingId = data.votingId || '';

        this.authorId = data.authorId || '';
        this.description = data.description || '';

        this.preview = data.preview||false;

        console.log('User assigned ', data, data.title, data.replyParentId);
    }


    static getLinkAttachment(Reply){
        for (let i=0; i<Reply.arrAttachments.length; i++)
            if (Reply.arrAttachments[i].type === "link"){
                return Reply.arrAttachments[i];
            }

        return null;
    }

    static getTitle(Reply){
        if (Reply.title !== '') return Reply.title;
        if (this.getLinkAttachment(Reply) !== null) return this.getLinkAttachment(Reply).title;
        if (Reply.arrAttachments.length > 0 ) return Reply.arrAttachments[0].title;

        return '';
    }

    static getDescription(Reply){
        if (Reply.description !== '') return Reply.description;
        if (this.getLinkAttachment(Reply) !== null) return this.getLinkAttachment(Reply).description;
        if (Reply.arrAttachments.length > 0 ) return Reply.arrAttachments[0].description;

        return '';
    }

    static getImage(Reply){
        if ((typeof Reply.image !== "undefined")&&(Reply.image !== '')) return Reply.image;

        if (Reply.arrAttachments.length > 0 ) //I have an uploaded image
            for (let i=0; i<Reply.arrAttachments.length; i++)
                if ((Reply.arrAttachments[i].type === "file")&&(Reply.arrAttachments[i].typeFile.indexOf("image") >= 0 ))
                    return Reply.arrAttachments[0].img;

        if (this.getLinkAttachment(Reply) !== null) return this.getLinkAttachment(Reply).img;

        return '';
    }



}