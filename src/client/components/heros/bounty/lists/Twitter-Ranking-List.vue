<template>

    <div>

        <loading-spinner class="bountySpinner" v-if="fetchingList" />

        <div v-if="!fetchingList" class="list">

            <div class="listHead listElement twitterElement">
                <div>No.</div>
                <div class="title">Tweet content</div>
                <div>UserName</div>
                <div>Likes</div>
                <div>Tweets</div>
                <div>Comments</div>
                <div>Score</div>
                <div>Reward WEBD</div>
            </div>

            <div>

                <a  v-for="(element, index) in list" :key="'TwitterRankingListElement '+index" class="listElement twitterElement" :href="element.url" target="_blank">

                    <div class="mobileTableShow">
                        <span class="mobileTableShowTitle">Position:</span>
                        <div>{{index+1}}</div>
                    </div>
                    <div class="mobileTableShow">
                        <span class="mobileTableShowTitle">Tweet content:</span>
                        <div class="title">{{element.description.substr(0, 50).replace(/\n/g,'')}}</div>
                    </div>
                    <div class="mobileTableShow">
                        <span class="mobileTableShowTitle">UserName:</span>
                        <div>{{element.username}}</div>
                    </div>
                    <div class="mobileTableShow">
                        <span class="mobileTableShowTitle">Likes:</span>
                        <div>{{element.likes}}</div>
                    </div>
                    <div class="mobileTableShow">
                        <span class="mobileTableShowTitle">Tweets:</span>
                        <div>{{element.shares}}</div>
                    </div>
                    <div class="mobileTableShow">
                        <span class="mobileTableShowTitle">Comments:</span>
                        <div> - </div>
                    </div>
                    <div class="mobileTableShow">
                        <span class="mobileTableShowTitle">Score:</span>
                        <div>{{element.score !== undefined ? element.score.toFixed(2) : 'na'}}</div>
                    </div>
                    <div class="mobileTableShow">
                        <span class="mobileTableShowTitle">Reward WEBD:</span>
                        <div class="score">{{element.reward !== undefined ? element.reward.toFixed(2) : 'na'}}</div>
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

            numberWithCommas(x){
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },


        },




    }

</script>