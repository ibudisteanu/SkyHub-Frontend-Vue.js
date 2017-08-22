/**
 * Created by BIT TECHNOLOGIES on 7/12/2017.
 */

import {addSuffix} from './helpers/MixinHelpers';

/*
 KEYWORDS
 */

function getKeywords (vm) {
    const { keywords } = vm.$options
    if (keywords) {
        let keywordsData = typeof keywords === 'function'
            ? keywords.call(vm)
            : keywords || '';

        if ((typeof keywordsData === 'undefined')||(keywordsData === null)) return '';
        else return keywordsData.toString() //converting array to keywords string like "a,b,c,d"
    }
}

const serverKeywordsMixin = {
    created () {
        const keywords = getKeywords(this)
        if (keywords)
            this.$ssrContext.SEOMixinKeywords = keywords
    }
}

const clientKeywordsMixin = {
    mounted () {
        const keywords = getKeywords(this)
        if (keywords)
            document.SEOMixinKeywords = keywords
    }
}

export default process.env.VUE_ENV === 'server'
    ?  serverKeywordsMixin
    :  clientKeywordsMixin