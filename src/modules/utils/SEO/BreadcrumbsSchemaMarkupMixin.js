/**
 * Created by BIT TECHNOLOGIES on 7/12/2017.
 */

/*
 BREADCRUMBS SCHEMA MARKUP based on https://developers.google.com/search/docs/data-types/breadcrumbs#guidelines
 TESTING: https://search.google.com/structured-data/testing-tool
 */

function getBreadcrumbsMarkup (vm) {
    const { breadcrumbs, title, url} = vm.$options
    if ((breadcrumbs)){

        let breadcrumbsData = typeof breadcrumbs === 'function'
            ? breadcrumbs.call(vm)
            : breadcrumbs || [];

        let titleData = typeof title === 'function'
            ? title.call(vm)
            : title  || [];

        let urlData = typeof url === 'function'
            ? url.call(vm)
            : url  || [];

        if ((typeof breadcrumbsData === 'undefined')||(breadcrumbsData === null)||(breadcrumbsData.length === 0)) breadcrumbsData = [ {name: "Home", url: "http://skyhub.me/"}];

        let breadcrumbsItems = [];

        let iPosition = 0;

        breadcrumbsItems.push({"@type": "ListItem",
            "position": ++iPosition,
            item: {
            "@id": "https://webdollar.io/",
                name: "Home",
                // image: "http://webdollar.io/public/square.png"
        }});

        for (let i=0; i<breadcrumbsData.length; i++){
            breadcrumbsItems.push({"@type": "ListItem",
                "position": ++iPosition,
                "item": {
                    "@id": breadcrumbsData[i].url,
                    name: breadcrumbsData[i].name,
                    //image: "/public/SkyHub-logo-square.png"
                }});
        }

        if ((urlData !== '')&&(urlData !== '/')){
            breadcrumbsItems.push({"@type": "ListItem",
                "position": ++iPosition,
                "item": {
                    "@id": urlData,
                    name: titleData,
                    //image: "/public/SkyHub-logo-square.png"
                }});
        }

        return {
            "@context": "http://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbsItems,
        };

    }
}

const serverBreadcrumbsMixin = {
    created () {
        const schemaMarkup = getBreadcrumbsMarkup(this)
        if (schemaMarkup)
            this.$ssrContext.SEOMixinBreadcrumbsSchemaMarkup = schemaMarkup
    }
}

const clientBreadcrumbsMixin = {
    mounted () {
        const schemaMarkup = getBreadcrumbsMarkup(this)
        if (schemaMarkup)
            document.SEOMixinBreadcrumbsSchemaMarkup = schemaMarkup
    }
}

export default process.env.VUE_ENV === 'server'
    ?  serverBreadcrumbsMixin
    :  clientBreadcrumbsMixin