/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <div>

        <HeaderCover
                :title="this.title"
                :subTitle="this.subTitle"
        />

        <DisplayForumContent />

    </div>

</template>


<script>

    import HeaderCover from 'client/components/Template/Template-components/Header/Cover/HeaderCover.component.vue';
    import DisplayForumContent from 'modules/forums/forums/view-forum/DisplayForumContent.vue';

    export default{
        name: "ViewHome",

        components: {
            'HeaderCover': HeaderCover,
            'DisplayForumContent' : DisplayForumContent,
        },

        computed:{

            title(){
                return this.$store.state.global.applicationName === "Aggregator" ? 'Agregator Stiri' :  'SkyHub Social Network';
            },

            subTitle(){
                return this.$store.state.global.applicationName === "Aggregator" ? 'Toate stirile tale' : 'Change the world together' ;
            }

        },


    }
</script>