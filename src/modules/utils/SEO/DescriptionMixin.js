
/**
 * Created by BIT TECHNOLOGIES on 7/12/2017.
 */

import {addSuffix} from './MixinHelpers';

/*
 DESCRIPTION
 */


function getDescription (vm) {
    const { description } = vm.$options
    if (description) {
        let result = typeof description === 'function'
            ? description.call(vm)
            : description || '';

        return addSuffix(result, ' - SkyHub Forum Social Network', ' - SkyHub', 150)
    }
}

const serverDescriptionMixin = {
    created () {
        const description = getDescription(this);
        if (description)
            this.$ssrContext.description = description
    }
}

const clientDescriptionMixin = {
    mounted () {
        const description = getDescription(this);
        if (description)
            document.description = description
    }
}


export default process.env.VUE_ENV === 'server'
    ?  serverDescriptionMixin
    :  clientDescriptionMixin
