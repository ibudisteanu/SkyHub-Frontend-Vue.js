/**
 * Created by BIT TECHNOLOGIES on 7/12/2017.
 */

import {addSuffix} from './MixinHelpers';

/*
 FACEBOOK DESCRIPTION
 */

function getDescriptionFacebook (vm) {
    const { description } = vm.$options
    if (description) {
        let result = typeof description === 'function'
            ? description.call(vm)
            : description || '';

        return addSuffix(result, ' - SkyHub Forum Social Network', ' - SkyHub', 110)
    }
}

const serverDescriptionFacebookMixin = {
    created () {
        const description = getDescriptionFacebook(this)
        if (description)
            this.$ssrContext.descriptionFacebook = description
    }
}

const clientDescriptionFacebookMixin = {
    mounted () {
        const description = getDescriptionFacebook(this)
        if (description)
            document.descriptionFacebook = description
    }
}

export default process.env.VUE_ENV === 'server'
    ?  serverDescriptionFacebookMixin
    :  clientDescriptionFacebookMixin