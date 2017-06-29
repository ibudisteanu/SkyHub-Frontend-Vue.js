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

        <div class="attachment">
            <router-link :to="attachment.URL||''" >
                <img class="attachment-img" :src="attachment.img||''"  :alt="attachment.title+' '+attachment.description" />
            </router-link>
            <div class="word-wrap attachment-img-text">{{attachment.type}}</div>
        </div>

</template>




<script>

    export default{

        name: 'DisplayAttachment',

        props:{
            attachment: {default: {}},
        }

    }

</script>