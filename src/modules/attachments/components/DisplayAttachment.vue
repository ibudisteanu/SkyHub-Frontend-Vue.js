/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/29/2017.
 * (C) BIT TECHNOLOGIES
 */

/*
    ATTACHMENTs

    type:'link',
    url: link,
    img:
    title:
    description:
    keywords:

*/

<template>

    <router-link :to="attachment.URL||''" >
        <img :src="attachment.img||''" :style="{backgroundColor: '#79B0EC', maxWidth: 64, maxHeight:64 }" />
        <span>{{attachment.title||'}}</span>
    </router-link>

</template>




<script>

    export default{

        name: 'DisplayAttachment',

        props:{
            attachment: {default: {}},
        }

    }

</script>