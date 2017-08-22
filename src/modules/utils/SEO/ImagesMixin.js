/**
 * Created by BIT TECHNOLOGIES on 7/12/2017.
 */

import {addSuffix} from './helpers/MixinHelpers';

/*
 IMAGES
 */

function getImages (vm) {
    const { images } = vm.$options
    if (images) {
        let imagesData = typeof images === 'function'
            ? images.call(vm)
            : images || [];

        if ((typeof imagesData === 'undefined')||(imagesData === null)) return '';

        let mixinImages = '';
        for (let i=0; i<imagesData; i++){
            mixinImages += '<meta property="og:image"  content="'+imagesData[i].url+'"  />';
            mixinImages += '<meta property="og:image:alt" content="'+imagesData[i].alt+'" />';
            mixinImages += '<meta property="twitter:image"  content="'+imagesData[i].url+'" />';
            mixinImages += '<meta property="twitter:image:alt" content="'+imagesData[i].alt+'"   />';
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