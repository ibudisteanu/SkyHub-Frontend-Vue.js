/**
 * Created by BIT TECHNOLOGIES on 7/12/2017.
 */

import {addSuffix} from './MixinHelpers';

/*
 FACEBOOK TITLE
 */

function getTitleFacebook (vm) {
    const { title } = vm.$options
    if (title) {
        let result = typeof title === 'function'
            ? title.call(vm)
            : title || '';

        return addSuffix( result, ' - SkyHub Social Network',' - SkyHub', 60);
    }
}

const serverTitleFacebookMixin = {
    created () {
        const title = getTitleFacebook(this)
        if (title)
            this.$ssrContext.titleFacebook = title
    }
}

const clientTitleFacebookMixin = {
    mounted () {
        const title = getTitleFacebook(this)
        if (title)
            document.titleFacebook = title
    }
}

export default process.env.VUE_ENV === 'server'
    ?  serverTitleFacebookMixin
    :  clientTitleFacebookMixin