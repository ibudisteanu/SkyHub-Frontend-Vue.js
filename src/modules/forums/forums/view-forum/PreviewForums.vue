/**
 * Created by BIT TECHNOLOGIES on 5/28/2017.
 */

<template>
    <div>
        <div class="lightBoxGallery image-with-caption-link">

            <PreviewForum
                    v-for="(forum, index) in forums"
                    :forum="forum"
                    :key="'PreviewForum_'+forum.id||''"
            />


        </div>

        <LoadingButton v-if="hasNext" className="btn-success  center-block" icon="fa fa-refresh" text="Load More Forums" @onClick="handleLoadMoreForums" ref="refLoadingMoreButton"/>

        <div v-if="error !== ''">
            <div class="alert alert-danger alert-dismissable">
                <div v-html="this.error" />
            </div>
        </div>

    </div>
</template>

<script>

    import PreviewForum from './PreviewForum.vue';
    import LoadingButton from 'client/components/util-components/UI/buttons/LoadingButton.vue';

    export default{
        name: 'PreviewForums',

        components: {
            'PreviewForum':PreviewForum,
            'LoadingButton': LoadingButton,
        },

        data() {
            return {
                error: '',
            }
        },

        props: {
            forums: {default: function () {return []}},
            parentId: {default: ''},
            hasNext: {default: false},
        },

        computed:{

        },

        methods:{
            async handleLoadMoreForums(){

                this.error = '';
                try{
                    await this.$store.dispatch('CONTENT_FORUMS_FETCH_TOP_NEXT', {parent: this.parentId});

                    if (typeof this.$refs['refLoadingMoreButton'] !== 'undefined')  this.$refs['refLoadingMoreButton'].enableButton();
                } catch (Exception){
                    this.error = "Error! Couldn't load  the forums " + Exception.toString();

                    if (this.$refs['refLoadingMoreButton'] !== 'undefined')  this.$refs['refLoadingMoreButton'].enableButton();
                }

            }
        }

    }
</script>
