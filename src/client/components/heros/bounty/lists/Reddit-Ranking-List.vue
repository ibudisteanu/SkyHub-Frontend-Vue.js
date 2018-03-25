<template>

    <div>

        <loading-spinner v-if="fetchingList" />

        <div v-if="!fetchingList" class="list">

            <div class="listHead listElement redditElement">
                <div>
                    No.
                </div>

                <div class="title">
                    Post description
                </div>

                <div>
                    User
                </div>

                <div>
                    Value Score
                </div>

                <div>
                    Comments
                </div>

                <div>
                    Score
                </div>
            </div>

            <div class="listElement redditElement" v-for="(element, index) in list" :key="'FacebookRankingListElement '+index">
                <div>
                  {{index+1}}
                </div>
                <div class="title">
                    {{element.title.substring(0,50) || element.description.substring(0, 50)}}
                </div>
                <div>
                    {{element.username.substring(0,20)}}
                </div>
                <div>
                    {{element.scoreValue}}
                </div>
                <div>
                    {{element.comments}}
                </div>
                <div class="score">
                    {{element.score.toFixed(2)}}
                </div>
                <!--<div>-->
                <!--{{element.status}}-->
                <!--</div>-->
                <!--<div>-->
                <!--{{element.dtCreation}}-->
                <!--</div>-->
            </div>

        </div>

    </div>

</template>

<script>

    import LoadingSpinner from "client/components/UI/elements/Loading-Spinner.vue"

    export default{

        components:{ LoadingSpinner },

        props:{
            fetchingList: {default: true},
            list: {default: function (){ return { } }},
        },

        methods:{
        },


    }

</script>