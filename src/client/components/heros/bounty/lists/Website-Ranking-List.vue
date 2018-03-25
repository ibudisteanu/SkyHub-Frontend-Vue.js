<template>

    <div>

        <loading-spinner class="bountySpinner" v-if="fetchingList" />

        <div v-if="!fetchingList" class="list">

            <div class="listHead listElement webSiteElement">

                <div>
                    No.
                </div>

                <div class="title">
                    Post Link
                </div>

                <div>
                    Alexa Score
                </div>

                <div>
                    Score
                </div>

            </div>

            <div class="listElement webSiteElement" v-for="(element, index) in list" :key="'FacebookRankingListElement '+index">
                <div>
                    {{index+1}}
                </div>

                <div class="title">
                    {{element.link}}
                </div>
                <div>
                    {{element.alexaScore.toFixed(2)}}
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



        }

    }

</script>