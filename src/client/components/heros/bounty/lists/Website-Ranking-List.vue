<template>

    <div>

        <loading-spinner class="bountySpinner" v-if="fetchingList" />

        <div v-if="!fetchingList" class="list">

            <div class="listHead listElement webSiteElement">

                <div>No.</div>
                <div class="title">Post Link</div>
                <div>Alexa Score</div>
                <div>Score</div>
                <div>Reward WEBD</div>

            </div>

            <div class="listElement webSiteElement" v-for="(element, index) in list" :key="'FacebookRankingListElement '+index">

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Status:</span>
                    <div>{{index+1}}</div>
                </div>
                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Status:</span>
                    <div class="title">{{element.link}}</div>
                </div>
                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Status:</span>
                    <div>{{element.alexaScore.toFixed(2)}}</div>
                </div>
                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Status:</span>
                    <div class="score">{{element.reward !== undefined ? element.reward.toFixed(2) : 'na'}}</div>
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