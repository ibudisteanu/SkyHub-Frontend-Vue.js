/**
 * Created by BIT TECHNOLOGIES on 7/12/2017.
 */

/*
 SCHEMA MARKUP basedo n https://jsonld.com/web-page/
 */

function getSchemaMarkup (vm) {
    const { title, keywords, description, images, author, webPageType } = vm.$options
    if ((images) && (title) && (description)){
        let imagesData = typeof images === 'function'
            ? images.call(vm)
            : images || [];

        let titleData = typeof images === 'function'
            ? title.call(vm)
            : title;

        let descriptionData = typeof description === 'function'
            ? description.call(vm)
            : description;

        let webPageTypeData = typeof webPageType === 'function'
            ? webPageType.call(vm)
            : webPageType;

        let keywordsData = typeof keywords === 'function'
            ? keywords.call(vm)
            : keywords;

        let authorData = typeof author === 'function'
            ? author.call(vm)
            : author || 'SkyHub';

        if (typeof imagesData === 'undefined') imagesData = [];
        if ((typeof titleData === 'undefined')||(titleData === '')) titleData = 'SkyHub Forum 2.0 Social Network';
        if ((typeof descriptionData === 'undefined')||(descriptionData === '')) descriptionData = 'Change the world together!';
        if ((typeof webPageTypeData === 'undefined')||(webPageTypeData === '')) webPageTypeData = 'website';
        if ((typeof keywordsData === 'undefined')||(keywordsData === null)||(keywordsData.length === 0)) keywordsData = ['social network, forum 2.0, forums, discussions, networks, communities'];

        let mixinSchemas = '';
        switch (webPageTypeData) {
            case '':
            case 'website':
                return; //Default Website Mixin

            case 'webpage':
                mixinSchemas+=
                    '"@context": "http://schema.org",'+
                    '"@type": "WebSite",'+
                    '"url": "http://skyhub.me/",'+
                    '"name": "'+titleData+'",'+
                    '"author": "'+authorData+'",'+
                    '"description": "'+descriptionData+'"'+
                    '"publisher": "SkyHub Forum 2.0 Social Network",'+
                    '"potentialAction": {'+
                        '"@type": "SearchAction",'+
                        '"target": "http://www.example.com/?s={search_term}",'+
                        '"query-input": "required name=search_term" }';
                return;
            case 'article':
                mixinSchemas +=
                    '"@context": "http://schema.org",'+
                    '"@type": "Article",'+
                    '"headline": "'+titleData+'",'+
                    '"alternativeHeadline": "'+descriptionData.substr(0,30)+'",'+
                    '"image": "http://example.com/image.jpg",'+
                    '"author": "'+authorData+'",'+
                    '"editor": "'+authorData+'",'+
                    //'"genre": "search engine optimization",'+
                    '"keywords": "'+keywordsData.toString()+'",'+
                    //'"wordcount": "1120",'+
                    '"publisher": "SkyHub Forum 2.0 Social Network",'+
                    '"url": "http://skyhub.me",'+
                    '"datePublished": "2015-09-20",'+
                    '"dateCreated": "2015-09-20",'+
                    '"dateModified": "2015-09-20",'+
                    '"description": "'+descriptionData.substr(0,100)+'",'+
                    '"articleBody": "'+descriptionData+'"';
                return;
        }


        return mixinSchemas;

    }
}

const serverSchemaMarkupMixin = {
    created () {
        const schemaMarkup = getSchemaMarkup(this)
        if (schemaMarkup)
            this.$ssrContext.SEOMixinSchemaMarkup = schemaMarkup
    }
}

const clientSchemaMarkupMixin = {
    mounted () {
        const schemaMarkup = getSchemaMarkup(this)
        if (schemaMarkup)
            document.SEOMixinSchemaMarkup = schemaMarkup
    }
}

export default process.env.VUE_ENV === 'server'
    ?  serverSchemaMarkupMixin
    :  clientSchemaMarkupMixin