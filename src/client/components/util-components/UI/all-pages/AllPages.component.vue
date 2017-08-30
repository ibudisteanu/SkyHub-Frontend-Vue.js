<template>

    <div>
        <h3>All Pages</h3>


        <strong v-if="allPagesList.length > 0">
            <router-link
                    v-for="(page, index) in allPagesList"
                    :key="'AllPages'+index"
                    :to="'/'+page+'#top'"
            >

                {{page}}
                <br/> <br/>

            </router-link>
        </strong>

        <Pagination :url="this.getURL" :pageIndex="this.allPagesPageIndex" :hasNext="this.allPagesHasNext" prefix="pages" />

    </div>

</template>


<script>

    import Pagination from 'client/components/util-components/UI/pagination/Pagination.component.vue';

    export default{
        name: 'AllPages',

        components:{
            'Pagination' : Pagination,
        },

        props: {
            'parentIndex' : {default: ''},
            'pageIndex': {default: 1},
            'hasNext': {default: true},
        },

        computed:{
            getURL(){
                return this.$store.state.content.contentRouter.currentObject.pageURL;
            },

            allPagesList(){
                let allPagesList = this.$store.getters.getAllPagesList;

                return  allPagesList;
            },

            allPagesHasNext(){
                return this.$store.state.content.contentAllPages.hasNext;
            },

            allPagesPageIndex(){
                return this.$store.state.content.contentAllPages.pageIndex;
            },
        },

        methods: {

        }
    }

</script>