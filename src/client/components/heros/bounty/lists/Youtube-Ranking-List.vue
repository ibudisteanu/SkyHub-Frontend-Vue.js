<template>

    <div class="list">

        <div class="listHead listElement youtubeElement">
            <div>No.</div>
            <div class="title">Title</div>
            <div>Views</div>
            <div>Comments</div>
            <div>Thumbs Up</div>
            <div>Thumbs Down</div>
            <div>Score</div>
        </div>

        <div class="listElement youtubeElement" v-for="(element, index) in this.list" :key="'YoutubeRankingListElement '+index">
            <div>
                {{index+1}}
            </div>
            <div class="title">
                {{element.title.substring(0, 200)}}
            </div>
            <div>
                {{numberWithCommas(element.views)}}
            </div>
            <div>
                {{element.comments}}
            </div>
            <div>
                {{element.thumbsUp}}
            </div>
            <div>
                {{element.thumbsDown}}
            </div>
            <div class="score">
                {{element.score !== undefined ? element.score.toFixed(2) : 'na'}}
            </div>

        </div>

    </div>

</template>

<script>

    export default{

        props:{
            list: {default: function (){ return { } }},
        },

        methods:{

            numberWithCommas(x){
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },

        },


    }

</script>