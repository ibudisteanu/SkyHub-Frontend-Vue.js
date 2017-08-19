/**
 * Created by BIT TECHNOLOGIES on 7/12/2017.
 */

import {addSuffix} from './MixinHelpers';

/*
 KEYWORDS
 */

function getImages (vm) {
    const { images } = vm.$options
    if (images) {
        let imagesData = typeof images === 'function'
            ? images.call(vm)
            : images || [];

        if ((typeof imagesData === 'undefined')||(imagesData === null)) return '';

        return imagesData; //converting array to keywords string like "a,b,c,d"
    }
}

const serverImagesMixin = {
    created () {
        const images = getImages(this)
        if (images)
            this.$ssrContext.imagesMixinData = images
    }
}

const clientImagesMixin = {
    mounted () {
        const images = getImages(this)
        if (images)
            document.imagesMixinData = images
    }
}

export default process.env.VUE_ENV === 'server'
    ?  serverImagesMixin
    :  clientImagesMixin