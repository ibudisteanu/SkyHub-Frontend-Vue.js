
/**
 * Created by BIT TECHNOLOGIES on 7/12/2017.
 */

import {addSuffix} from './helpers/MixinHelpers';

/*
 DESCRIPTION
 */


function getDescription (vm) {
    const { description } = vm.$options
    if (description) {
        let result = typeof description === 'function'
            ? description.call(vm)
            : description || '';

        return {
            'description':addSuffix(result, ' - SkyHub Forum Social Network', ' - SkyHub', 150),
            'facebook':addSuffix(result, ' - SkyHub Forum Social Network', ' - SkyHub', 110),
            'twitter': addSuffix(result, ' - SkyHub Forum Social Network', ' - SkyHub', 116),
        }
    }
}

const serverDescriptionMixin = {
    created () {
        const description = getDescription(this);
        if (description)
            this.$ssrContext.SEOMixinDescription = description
    }
}

const clientDescriptionMixin = {
    mounted () {
        const description = getDescription(this);
        if (description)
            document.SEOMixinDescription = description
    }
}


export default process.env.VUE_ENV === 'server'
    ?  serverDescriptionMixin
    :  clientDescriptionMixin
