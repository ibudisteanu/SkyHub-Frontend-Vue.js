<template>

    <div>

        <div class="list">

            <div class="listHead listElement instagramElement">
                <div>
                    No.
                </div>

                <div class="title">
                    Post description
                </div>

                <div>
                    Likes
                </div>

                <div>
                    Comments
                </div>

                <div>
                    Score
                </div>
            </div>

            <div class="listElement instagramElement" v-for="(element, index) in list" :key="'FacebookRankingListElement '+index">
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
                    {{element.comments}}
                </div>
                <div class="score">
                    {{element.score.toFixed(2)}}
                </div>
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