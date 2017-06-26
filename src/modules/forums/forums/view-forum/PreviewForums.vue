/**
 * Created by BIT TECHNOLOGIES on 5/28/2017.
 */

<template>
    <div class="lightBoxGallery">

        <PreviewForum
                v-for="(forum, index) in forums"
                :forum="forum"
                :key="'PreviewForum_'+forum.id||''"
        />


    </div>
</template>

<script>

    import PreviewForum from './PreviewForum.vue';

    export default{
        name: 'PreviewForums',

        components: {
            'PreviewForum':PreviewForum,
        },

        props: {
            forums: {default: function () {return []}},
        }

    }
</script>
