/**
 * Created by BIT TECHNOLOGIES on 5/28/2017.
 */

<template>

    <HeaverCoverSimple :title="'WebDollar'"
                 :subTitle="'Disrupting Crypto'"
                 :breadcrumbs="[]"
                 url="/"
    >

    </HeaverCoverSimple>

</template>


<script>

    import HeaverCoverSimple from './HearCoverSimple.component.vue';

    export default{

        name: 'WebsiteHeaderCover',

        components: {
            'HeaverCoverSimple': HeaverCoverSimple,
        },

        params:{
            subTitle: {default: ''},
            title: {default: ''},
            coverPic: {default:''},
        }

    }
</script>