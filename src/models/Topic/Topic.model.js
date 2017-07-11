/**
 * Created by BIT TECHNOLOGIES on 5/28/2017.
 */

import Attachments from 'models/Attachment/Attachments.model';

export default class Topic {


    constructor( data ) {

        this.id = data.id || '';

        this.title = data.title || '';
        this.description = data.description || '';
        this.shortDescription = data.shortDescription || '';

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

        //console.log('Topic Assigned', data);
    }

    getAuthor(){
        return null;
    }


    static getTitle(Topic){

      if (Topic.title !== '') return Topic.title;
      if (Attachments.getLinkAttachment(Topic) !== null) return Attachments.getLinkAttachment(Topic).title;
      if (Topic.attachments.length > 0 ) return Topic.attachments[0].title;

      return '';
    }

    static getDescription(Topic){
      if (Topic.shortDescription !== '') return Topic.shortDescription;
      if (Attachments.getLinkAttachment(Topic) !== null) return Attachments.getLinkAttachment(Topic).description;
      if (Topic.attachments.length > 0 ) return Topic.attachments[0].description;

      return '';
    }

    static getImage(Topic){
      //if ((typeof Topic.image !== "undefined")&&(Topic.image !== '')) return Topic.image;

      if (Topic.attachments.length > 0 ) //I have an uploaded image
        for (let i=0; i<Topic.attachments.length; i++)
          if ((Topic.attachments[i].type === "file")&&(Topic.attachments[i].typeFile.indexOf("image") >= 0 ))
            return Topic.attachments[0].img;

      if (Attachments.getLinkAttachment(Topic) !== null) return Attachments.getLinkAttachment(Topic).img;

      return '';
    }

    static getKeywords(Topic){
      if ((typeof Topic.keywords !== "undefined")&&(Topic.keywords !== '')) return Topic.keywords;
      if (Attachments.getLinkAttachment(Topic) !== null) return Attachments.getLinkAttachment(Topic).keywords;
      if (Topic.attachments.length > 0 ) return Topic.attachments[0].keywords;

      return '';
    }


}
