/**
 * Created by BIT TECHNOLOGIES on 7/12/2017.
 */

import {addSuffix} from './MixinHelpers';

/*
 TWITTER DESCRIPTION
 */

function getDescriptionTwitter (vm) {
    //twitter - limit 116 description (92 with images on) and 70 Title
    const { description } = vm.$options
    if (description) {
        let result = typeof description === 'function'
            ? description.call(vm)
            : description || '';

        return addSuffix(result, ' - SkyHub Forum Social Network', ' - SkyHub', 116)
    }
}

const serverDescriptionTwitterMixin = {
    created () {
        const description = getDescriptionTwitter(this)
        if (description)
            this.$ssrContext.descriptionTwitter = description
    }
}

const clientDescriptionTwitterMixin = {
    mounted () {
        const description = getDescriptionTwitter(this)
        if (description)
            document.descriptionTwitter = description
    }
}

export default process.env.VUE_ENV === 'server'
    ?  serverDescriptionTwitterMixin
    :  clientDescriptionTwitterMixin