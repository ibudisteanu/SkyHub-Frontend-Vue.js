/**
 * Created by BIT TECHNOLOGIES on 5/28/2017.
 */

/* eslint-disable import/prefer-default-export */

export default class Topic {

    id;

    title;
    URL;

    image: '';
    description;

    arrAttachments: [];
    arrKeywords: [];
    arrBreadcrumbs: [];

    authorId: '';
    parentId: '';
    parents: [];

    preferredLang;


    longitude;
    latitude;

    country;
    city;

    dtCreation;
    dtLastActivity;


    preview:false;

    constructor( data: Object = {}) {

        this.id = data.id || '';

        this.title = data.title || '';
        this.description = data.description || '';

        this.URL = data.URL || '';

        this.image = data.image || '';


        this.arrKeywords = data.keywords || [];
        this.arrAttachments = data.attachments || [];
        this.arrBreadcrumbs = data.breadcrumbs || [];

        this.authorId = data.authorId || '';
        this.parentId = data.parentId || '';
        this.parents = data.parents || [];

        this.preferredLang = data.preferredLang || data.language || null;

        this.country = data.country || '';
        this.city = data.city || '';
        this.dtCreation = ((typeof data.dtCreation === "string")&&(data.dtCreation !== '')) ? Date.parse(data.dtCreation) : new Date(data.dtCreation||new Date());
        this.dtLastActivity = ((typeof data.dtLastActivity === "string")&&(data.dtLastActivity !== '')) ? Date.parse(data.dtLastActivity) : new Date(data.dtLastActivity||new Date());

        this.longitude = data.longitude || -666;
        this.latitude = data.latitude || -666;

        this.preview = data.preview||false;

        console.log('Topic Assigned', data);
    }

    getAuthor(){
        return null;
    }


    static getLinkAttachment(Topic){
      for (let i=0; i<Topic.arrAttachments.length; i++)
        if (Topic.arrAttachments[i].type === "link"){
          return Topic.arrAttachments[i];
        }

      return null;
    }

    static getTitle(Topic){
      console.log("getTitle", Topic.title, Topic.attachments, this.getLinkAttachment(Topic));
      if (Topic.title !== '') return Topic.title;
      if (this.getLinkAttachment(Topic) !== null) return this.getLinkAttachment(Topic).title;
      if (Topic.arrAttachments.length > 0 ) return Topic.arrAttachments[0].title;

      return '';
    }

    static getDescription(Topic){
      if (Topic.description !== '') return Topic.description;
      if (this.getLinkAttachment(Topic) !== null) return this.getLinkAttachment(Topic).description;
      if (Topic.arrAttachments.length > 0 ) return Topic.arrAttachments[0].description;

      return '';
    }

    static getImage(Topic){
      if ((typeof Topic.image !== "undefined")&&(Topic.image !== '')) return Topic.image;

      if (Topic.arrAttachments.length > 0 ) //I have an uploaded image
        for (let i=0; i<Topic.arrAttachments.length; i++)
          if ((Topic.arrAttachments[i].type === "file")&&(Topic.arrAttachments[i].typeFile.indexOf("image") >= 0 ))
            return Topic.arrAttachments[0].img;

      if (this.getLinkAttachment(Topic) !== null) return this.getLinkAttachment(Topic).img;

      return '';
    }

    static getKeywords(Topic){
      if ((typeof Topic.arrKeywords !== "undefined")&&(Topic.arrKeywords !== '')) return Topic.arrKeywords;
      if (this.getLinkAttachment(Topic) !== null) return this.getLinkAttachment(Topic).keywords;
      if (Topic.arrAttachments.length > 0 ) return Topic.arrAttachments[0].keywords;

      return '';
    }


}
