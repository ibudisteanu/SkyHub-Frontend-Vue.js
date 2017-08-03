/**
 * Created by BIT TECHNOLOGIES on 7/12/2017.
 */

import {addSuffix} from './MixinHelpers';

/*
 TITLE
 */

function getTitle (vm) {
    const { title } = vm.$options
    if (title) {

        let result = typeof title === 'function'
            ? title.call(vm)
            : title || '';

        return addSuffix( result, ' - SkyHub Social Network',' - SkyHub', 53);
    }
}

const serverTitleMixin = {
    created () {
        const title = getTitle(this)
        if (title)
            this.$ssrContext.title = title
    }
}

const clientTitleMixin = {
    mounted () {
        const title = getTitle(this)
        if (title)
            document.title = title
    }
}


export default process.env.VUE_ENV === 'server'
    ?
    serverTitleMixin
    :
    clientTitleMixin
