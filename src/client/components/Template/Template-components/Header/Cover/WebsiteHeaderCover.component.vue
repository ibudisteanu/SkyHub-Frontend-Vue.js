/**
 * Created by BIT TECHNOLOGIES on 5/28/2017.
 */

<template>

    <HeaderCover :title="this.title||'SkyHub - Forum 2.0'"
                 :subTitle="this.subTitle||'Discover, Connect and Change the world together'"
                 :breadcrumbs="[]"
                 url="/"
    >

    </HeaderCover>

</template>


<script>

    import HeaderCover from './HeaderCover.component.vue';

    export default{

        name: 'WebsiteHeaderCover',

        components: ['HeaderCover'],

        params:{
            subTitle: {default: ''},
            title: {default: ''},
            coverPic: {default:''},
        }

    }
</script>