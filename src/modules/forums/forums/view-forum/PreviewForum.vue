/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/26/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>

    <router-link :to="forum.URL" >
        <img :src="forum.iconPic||''" :style="{backgroundColor: '#'+forum.coverColor||'#79B0EC' }" />
        <span>{{forum.title}}</span>
    </router-link>

</template>


<script>
    export default{
        name: 'PreviewForum',

        props: {
            forum: {default: null}
        },

    }
</script>