/**
 * Created by BIT TECHNOLOGIES on 5/28/2017.
 */

import Attachments from 'models/Attachment/Attachments.model';
import {sanitizeAdvanced, sanitizeAdvancedShortDescription} from 'modules/utils/global-utilities/SanitizeAdvanced';

export default class Topic {

    constructor( data ) {

        this.id = data.id || '';

        this.title = data.title || '';

        this.description = data.description || '';
        this.shortDescription = data.shortDescription || '';

        this.description = sanitizeAdvanced(this.description);
        this.shortDescription = sanitizeAdvancedShortDescription(this.shortDescription||this.description, 512);

        this.viewMore = false;
        if (this.description !== this.shortDescription)
            this.viewMore = true;

        this.URL = data.URL || '';

        //this.image = data.image || '';
        this.coverPic = data.coverPic || '';

        this.keywords = data.keywords || [];
        this.attachments = data.attachments || [];
        this.breadcrumbs = data.breadcrumbs || [];

        this.authorId = data.authorId || '';
        this.parentId = data.parentId || '';
        this.parents = data.parents || [];

        this.preferredLang = data.preferredLang || data.language || null;

        this.country = data.country || '';
        this.city = data.city || '';

        this.isOwner = data.isOwner || false;

        this.dtCreation = ((typeof data.dtCreation === "string")&&(data.dtCreation !== '')) ? Date.parse(data.dtCreation) : new Date(data.dtCreation||new Date());
        this.dtLastActivity = ((typeof data.dtLastActivity === "string")&&(data.dtLastActivity !== '')) ? Date.parse(data.dtLastActivity) : new Date(data.dtLastActivity||new Date());

        this.longitude = data.longitude || -666;
        this.latitude = data.latitude || -666;

        this.addInfo = data.addInfo || {};

        if (typeof this.addInfo.dtCreation !== 'undefined'){
            this.addInfo.dtCreation = ((typeof this.addInfo.dtCreation === "string")&&(this.addInfo.dtCreation !== '')) ? Date.parse(this.addInfo.dtCreation) : new Date(this.addInfo.dtCreation||new Date());
        }

        //console.log('Topic Assigned', data);
    }

    getAuthor(){
        return null;
    }




}
