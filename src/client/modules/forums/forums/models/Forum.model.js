/**
 * Created by BIT TECHNOLOGIES on 5/28/2017.
 */

/* eslint-disable import/prefer-default-export */

export default class Forum {

    id;

    title;
    URL;
    description;
    authorId;

    arrKeywords : [];
    arrBreadcrumbs: [];

    iconPic;
    coverPic;
    coverColor;

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

    constructor( data: Object = {}) {

        this.id = data.id||'';


        this.title = data.title || '';
        this.description = data.description || '';

        this.URL = data.URL || '';

        this.iconPic = data.iconPic || '';
        this.coverPic  = data.coverPic || '';
        this.coverColor = data.coverColor || '';

        this.arrKeywords = data.keywords||[];
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

        console.log('Forum Assigned', data);
    }

    static getAuthor(Topic){
        return null;
    }

    static isOwnerAuthor(Topic, UserAuthenticated){

    }


}
