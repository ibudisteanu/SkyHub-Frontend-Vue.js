<template>

    <div>

        <div class="list">

            <div class="listHead listElement redditElement">
                <div>
                    No.
                </div>

                <div class="title">
                    Post description
                </div>

                <div>
                    Posts
                </div>

                <div>
                    Comments
                </div>

                <div>
                    Votes
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
                    {{element.description.substring(0, 50)}}
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
                    {{element.score}}
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

    export default{

        props:{
            list: {default: function (){ return { } }},
        },

        methods:{
        },




    }

</script>