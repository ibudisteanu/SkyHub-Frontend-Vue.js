/*
 PAGE TYPE
 */

function getWebPageType (vm) {
    const { webPageType } = vm.$options
    if (webPageType) {

        let result = typeof webPageType === 'function'
            ? webPageType.call(vm)
            : webPageType || '';

        if ((typeof result === 'undefined') || (result === '')) return 'website';
        else return result;
    }
}

const serverWebPageTypeMixin = {
    created () {
        const webPageType = getWebPageType(this)
        if (webPageType)
            this.$ssrContext.SEOMixinWebPageType = webPageType
    }
}

const clientWebPageTypeMixin = {
    mounted () {
        const webPageType = getWebPageType(this)
        if (webPageType)
            document.SEOMixinWebPageType = webPageType
    }
}


export default process.env.VUE_ENV === 'server'
    ?
    serverWebPageTypeMixin
    :
    clientWebPageTypeMixin
