/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <div>
        <ViewForum v-if="getCurrentRouterObjectType === 'forum' || getCurrentRouterObjectType === 'none'" />

        <ViewTopic v-if="getCurrentRouterObjectType === 'topic'"/>
    </div>

</template>

<script>

    //import

    export default{
        name: 'PageContent',

        computed:{
            getCurrentRouterObjectType(){
                return this.$store.state.content.contentRouter.routerObject.type;
            }
        }

    }
</script>
