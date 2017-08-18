/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/26/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>

    <router-link :to="'/'+forum.URL+'#top'" >
        <img class="opacity-effect" :src="forum.iconPic||''" :style="{backgroundColor: '#'+forum.coverColor||'#79B0EC',   width: '150px', height: '150px'}" />
        <span>{{ typeof forum.title === 'string' && forum.title.length > 50 ? forum.title.substr(0,50)+'...' : forum.title}}</span>
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