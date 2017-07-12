/**
 * Created by BIT TECHNOLOGIES on 7/12/2017.
 */

import {addSuffix} from './MixinHelpers';

/*
 TWITTER TITLE
 */

function getTitleTwitter (vm) {
    //twitter - limit 116 description (92 with images on) and 70 Title

    const { title } = vm.$options
    if (title) {
        let result = typeof title === 'function'
            ? title.call(vm)
            : title

        return addSuffix( result, ' - SkyHub Social Network',' - SkyHub', 70);
    }
}

const serverTitleTwitterMixin = {
    created () {
        const title = getTitleTwitter(this)
        if (title)
            this.$ssrContext.titleTwitter = title
    }
}

const clientTitleTwitterMixin = {
    mounted () {
        const title = getTitleTwitter(this)
        if (title)
            document.titleTwitter = title
    }
}

export default process.env.VUE_ENV === 'server'
    ?  serverTitleTwitterMixin
    :  clientTitleTwitterMixin