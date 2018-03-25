<template>

    <div>

        <loading-spinner v-if="fetchingList" />

        <div v-if="!fetchingList" class="list">

            <div class="listHead listElement twitterElement">
                <div>
                    No.
                </div>

                <div class="title">
                    Tweet content
                </div>

                <div>
                    UserName
                </div>
                <div>
                    Likes
                </div>

                <div>
                    Tweets
                </div>

                <div>
                    Comments
                </div>

                <div>
                    Score
                </div>
            </div>

            <div class="listElement twitterElement" v-for="(element, index) in list" :key="'TwitterRankingListElement '+index">
                <div>
                    {{index+1}}
                </div>
                <div class="title">
                    {{element.description.substr(0, 50).replace(/\n/g,'')}}
                </div>
                <div>
                    {{element.username}}
                    <!--{{element.name}}-->
                </div>

                <div>
                    {{element.likes}}
                </div>
                <div>
                    {{element.shares}}
                </div>
                <div>
                    {{element.comments}}
                </div>

                <div class="score">
                    {{element.score !== undefined ? element.score.toFixed(2) : 0}}
                </div>

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