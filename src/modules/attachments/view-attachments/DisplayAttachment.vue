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
                <img class="attachment-img" :src="attachment.img||''"  :alt="attachment.title||''+' '+attachment.description||''" v-tooltip:top="attachment.title||''+' '+attachment.description||'" />
            </router-link>
            <div class="word-wrap attachment-img-text">
                <i v-if="attachment.type==='link'" class="fa fa-link"></i>
                <i v-else-if="attachment.type==='img'" class="fa fa-picture-o"></i>
                <i v-else class="fa fa-file"></i>
                {{(typeof attachment.title === 'string' && attachment.title.length > 50 ?  attachment.title.substr(0, 50)+'...' : attachment.title)}}
            </div>
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