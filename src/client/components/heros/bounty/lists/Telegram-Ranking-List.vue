<template>

    <div>

        <loading-spinner class="bountySpinner" v-if="fetchingList" />

        <div v-if="!fetchingList" class="list">

            <div class="listHead listElement telegramElement">
                <div>No.</div>
                <div class="title">User Name</div>
                <div>Invited members</div>
                <div>Messages</div>
                <div>Score</div>
                <div>Reward WEBD</div>
            </div>

            <div class="listElement telegramElement" v-for="(element, index) in this.list" :key="'TelegramRankingListElement '+index">

                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Position:</span>
                    <div>{{index+1}}</div>
                </div>
                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">User Name:</span>
                    <div class="title">{{element.username.substring(0, 50)}}</div>
                </div>
                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Invited members:</span>
                    <div>{{element.invitesCount}}</div>
                </div>
                <div class="mobileTableShow">
                    <span class="mobileTableShowTitle">Messages:</span>
                    <div>{{element.messages}}</div>
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