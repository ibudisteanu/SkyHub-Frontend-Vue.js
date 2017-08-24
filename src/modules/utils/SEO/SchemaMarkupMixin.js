/**
 * Created by BIT TECHNOLOGIES on 7/12/2017.
 */

/*
 SCHEMA MARKUP basedo n https://jsonld.com/web-page/

 EXAMPLE: https://search.google.com/structured-data/testing-tool/u/0/#url=https%3A%2F%2Fwww.joe-pagan.com%2Fblog%2Fgoogle-pagespeed-optimising-decorative-template-images
 */

function getSchemaMarkup (vm) {
    const { title, keywords, shortDescription, description, images, author, webPageType, dateCreation, dateLastActivity, url } = vm.$options
    if ((images) && (title) && (description)){
        let imagesData = typeof images === 'function'
            ? images.call(vm)
            : images || [];

        let titleData = typeof images === 'function'
            ? title.call(vm)
            : title;

        let shortDescriptionData = typeof shortDescription === 'function'
            ? shortDescription.call(vm)
            : shortDescription;

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

        let dateCreationData = typeof dateCreation === 'function'
            ? dateCreation.call(vm)
            : dateCreation;

        let dateLastActivityData = typeof dateLastActivity === 'function'
            ? dateLastActivity.call(vm)
            : dateLastActivity;

        let urlData = typeof url === 'function'
            ? url.call(vm)
            : url;

        if ((typeof imagesData === 'undefined')||(imagesData === null)||(imagesData.length === 0)) imagesData = [ {url: "http://skyhub.me/public/SkyHub-landing-image.jpg", alt:"SkyHub Forum 2.0 Social Network - Change the World"}];
        if ((typeof titleData === 'undefined')||(titleData === '')) titleData = 'SkyHub Forum 2.0 Social Network';
        if ((typeof descriptionData === 'undefined')||(descriptionData === '')) descriptionData = 'Change the world together!';
        if ((typeof webPageTypeData === 'undefined')||(webPageTypeData === '')) webPageTypeData = 'website';
        if ((typeof keywordsData === 'undefined')||(keywordsData === null)||(keywordsData.length === 0)) keywordsData = ['social network, forum 2.0, forums, discussions, networks, communities'];
        if ((typeof dateCreationData === 'undefined')||(dateCreationData === '')) dateCreationData = '';
        if ((typeof dateLastActivityData === 'undefined')||(dateLastActivityData === '')) dateLastActivityData = '';
        if ((typeof urlData === 'undefined')||(urlData==='')) urlData = "http://skyhub.me/";

        console.log(imagesData);

        let mixinSchemas = '';
        switch (webPageTypeData) {
            case '':
            case 'website':
                return; //Default Website Mixin

            case 'webpage':
                mixinSchemas ={
                    "@context": "http://schema.org",
                    "@type": "WebSite",
                    url: "http://skyhub.me/",
                    name: titleData,
                    author: authorData,
                    description: descriptionData,
                    publisher: "SkyHub Forum 2.0 Social Network",
                    potentialAction:{
                        "@type": "SearchAction",
                        target: "http://skyhub.me/search/{query}",
                        "query-input": "required name=query"
                    }
                };
                return mixinSchemas;
            case 'article':
                mixinSchemas = {
                    "@context": "http://schema.org",
                    "@type": "Article",
                    headline: titleData,
                    alternativeHeadline: descriptionData.substr(0,30),
                    image: {
                        "@type":"ImageObject",
                        url: imagesData[0].url,
                    },
                    author: authorData,
                    editor: authorData,
                    //genre: "search engine optimization",
                    keywords: keywordsData.toString(),
                    //'wordcount: "1120",
                    publisher: {
                        "@type":"Organization",
                        name:"SkyHub Forum 2.0 Social Network"
                    },
                    url: "http://skyhub.me",
                    datePublished: dateCreationData.toString(),
                    dateCreated: dateCreationData.toString(),
                    dateModified: dateLastActivityData.toString(),
                    description: shortDescriptionData.substr(0,100),
                    articleBody: descriptionData,
                    mainEntityOfPage: {
                        "@type": "WebPage",
                        "@id": urlData.toString()
                    },
                };

                return mixinSchemas;
        }

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