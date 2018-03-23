<template>

    <div>

        <div class="list">

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
                    {{element.score}}
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