<template>

    <div>

        <loading-spinner class="bountySpinner" v-if="fetchingList" />

        <div v-if="!fetchingList" class="list">

            <div class="listHead listElement telegramElement">
                <div>
                    No.
                </div>

                <div class="title">
                    User Name
                </div>

                <div>
                    Invited members
                </div>

                <div>
                    Messages
                </div>

                <div>
                    Score
                </div>
            </div>

            <div class="listElement telegramElement" v-for="(element, index) in this.list" :key="'TelegramRankingListElement '+index">
                <div>
                    {{index+1}}
                </div>

                <div class="title">
                    {{element.username.substring(0, 50)}}
                </div>
                <div class="score">
                    {{element.invitesCount}}
                </div>
                <div class="score">
                    {{element.messages}}
                </div>
                <div class="score">
                    {{element.score.toFixed(2)}}
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