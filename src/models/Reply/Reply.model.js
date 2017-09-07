/* eslint-disable import/prefer-default-export */

import Attachments from 'models/Attachment/Attachments.model';
import {sanitizeAdvanced, sanitizeAdvancedShortDescription} from 'modules/utils/global-utilities/SanitizeAdvanced';

export default class Reply {

    constructor( data) {

        if (typeof data === "undefined") data = {};

        this.id = data.id||'';

        this.title = data.title || '';
        this.topicId = data.topicId || '';

        this.parentReplyId = data.parentReplyId || '';
        this.parentId = data.parentId || '';

        this.authorId = data.authorId || '';

        this.description = data.description || '';
        this.shortDescription = data.shortDescription || '';

        this.description = sanitizeAdvanced(this.description);
        this.shortDescription = sanitizeAdvancedShortDescription(this.shortDescription||this.description,512);

        this.viewMore = false;
        if (this.description !== this.shortDescription)
            this.viewMore = true;


        this.preview = data.preview||false;

        this.isOwner = data.isOwner || false;

        this.attachments = data.attachments || [];
        this.URL = data.URL || '';

        this.dtCreation = ((typeof data.dtCreation === "string")&&(data.dtCreation !== '')) ? Date.parse(data.dtCreation) : new Date(data.dtCreation||new Date());
        this.dtLastActivity = ((typeof data.dtLastActivity === "string")&&(data.dtLastActivity !== '')) ? Date.parse(data.dtLastActivity) : new Date(data.dtLastActivity||new Date());

        this.addInfo = data.addInfo || {};

        if (typeof this.addInfo.dtRealCreation !== 'undefined'){
            this.addInfo.dtRealCreation = ((typeof this.addInfo.dtRealCreation === "string")&&(this.addInfo.dtRealCreation !== '')) ? Date.parse(this.addInfo.dtRealCreation) : new Date(this.addInfo.dtRealCreation||new Date());
        }

        //console.log('Reply assigned ', data, data.title, data.parentReplyId);
    }

}