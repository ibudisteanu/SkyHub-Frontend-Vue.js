<template>

    <div>

        <loading-spinner class="bountySpinner" v-if="fetchingList" />

        <div v-if="!fetchingList" class="list">

            <div class="listHead listElement youtubeElement">
                <div>No.</div>
                <div class="title">Title</div>
                <div>Views</div>
                <div>Comments</div>
                <div>T-Up</div>
                <div>T-Down</div>
                <div>Score</div>
                <div>Reward WEBD</div>
            </div>

            <div class="listElement youtubeElement" v-for="(element, index) in this.list" :key="'YoutubeRankingListElement '+index">

                <div>{{index+1}}</div>
                <div class="title">{{element.title.substring(0, 50)}}</div>
                <div>{{numberWithCommas(element.views)}}</div>
                <div>{{element.comments}}</div>
                <div>{{element.thumbsUp}}</div>
                <div>{{element.thumbsDown}}</div>
                <div>{{element.score !== undefined ? element.score.toFixed(2) : 'na'}}</div>
                <div class="score">{{element.reward !== undefined ? element.reward.toFixed(2) : 'na'}}</div>

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

            numberWithCommas(x){
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },

        },


    }

</script>