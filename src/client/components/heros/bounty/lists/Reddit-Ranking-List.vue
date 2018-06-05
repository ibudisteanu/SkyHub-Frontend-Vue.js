<template>

    <div>

        <loading-spinner class="bountySpinner" v-if="fetchingList" />

        <div v-if="!fetchingList" class="list">

            <div class="listHead listElement redditElement">
                <div>No.</div>
                <div class="title">Post description</div>
                <div>User</div>
                <div>Value Score</div>
                <div>Comments</div>
                <div>Score</div>
                <div>Reward WEBD</div>
            </div>

            <div class="listElement redditElement" v-for="(element, index) in list" :key="'FacebookRankingListElement '+index" >

                <a :href="element.url" target="_blank">
                    <div>
                        <div class="mobileTableShow">
                            <span class="mobileTableShowTitle">Position:</span>
                            <div>{{index+1}}</div>
                        </div>
                        <div class="mobileTableShow">
                            <span class="mobileTableShowTitle">Description:</span>
                            <div class="title">{{element.title.substring(0,50) || element.description.substring(0, 50)}}</div>
                        </div>
                        <div class="mobileTableShow">
                            <span class="mobileTableShowTitle">User:</span>
                            <div>{{element.username.substring(0,20)}}</div>
                        </div>
                        <div class="mobileTableShow">
                            <span class="mobileTableShowTitle">Value Score:</span>
                            <div>{{element.scoreValue}}</div>
                        </div>
                        <div class="mobileTableShow">
                            <span class="mobileTableShowTitle">Comments:</span>
                            <div>{{element.comments}}</div>
                        </div>
                        <div class="mobileTableShow">
                            <span class="mobileTableShowTitle">Score:</span>
                            <div>{{element.score !== undefined ? element.score.toFixed(2) : 'na'}}</div>
                        </div>
                        <div class="mobileTableShow">
                            <span class="mobileTableShowTitle">Reward WEBD:</span>
                            <div class="score">{{element.reward !== undefined ? element.reward.toFixed(2) : 'na'}}</div>
                        </div>
                    </div>
                </a>

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