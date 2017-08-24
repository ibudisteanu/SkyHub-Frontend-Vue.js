/**
 * Created by BIT TECHNOLOGIES on 7/12/2017.
 */

import {addSuffix} from './helpers/MixinHelpers';

/*
 IMAGES
 */

function getImages (vm) {
    const { images, title } = vm.$options
    if (images) {
        let imagesData = typeof images === 'function'
            ? images.call(vm)
            : images;

        let titleData = typeof title === 'function'
            ? title.call(vm)
            : title;

        if ((typeof imagesData === 'undefined')||(imagesData === null)||(imagesData.length === 0)) return '';

        let mixinImages = '';
        for (let i=0; i<imagesData.length; i++){

            let title = imagesData[i].title;
            if ((typeof title ==='undefined')||(title === null)||(title.length < 2)) title = titleData.toString();
            mixinImages += '<meta property="og:image"  content="'+imagesData[i].url+'"  />';
            mixinImages += '<meta property="og:image:alt" content="'+title+'" />';
            mixinImages += '<meta property="twitter:image"  content="'+imagesData[i].url+'" />';
            mixinImages += '<meta property="twitter:image:alt" content="'+title+'"   />';
        }

        return mixinImages;
    }
}

const serverImagesMixin = {
    created () {
        const images = getImages(this)
        if (images)
            this.$ssrContext.SEOMixinImages = images
    }
}

const clientImagesMixin = {
    mounted () {
        const images = getImages(this)
        if (images)
            document.SEOMixinImages = images
    }
}

export default process.env.VUE_ENV === 'server'
    ?  serverImagesMixin
    :  clientImagesMixin