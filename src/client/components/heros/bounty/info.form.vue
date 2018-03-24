<template>

    <div class="infoBounty">

        <div class="countDown">
            <span class="countDownTitle">{{this.type}} bounty end:</span>
            <countdown :deadline="this.deadline"></countdown>
        </div>

        <div class="campaignInfo">

            <div v-if="this.type === 'youtube'">

                <span class="infoLine">
                    <b>Score formula:</b> (Views/10 + ThumbsUp - ThumbsDown*3 + Comments*2)/40
                </span>
                <span class="infoLine">
                    <b>Conditions of participation:</b> WebDollar/webd in description and content
                </span>

            </div>
            <div v-if="this.type === 'facebook'">
                <b>Score formula:</b> (Likes + 3*shares + 1.5*comments)/30
                <b>Conditions of participation:</b> WebDollar/webd in description and content
            </div>
            <div v-if="this.type === 'instagram'">
                f
            </div>
            <div v-if="this.type === 'twitter'">
                f
            </div>
            <div v-if="this.type === 'telegram'">
                f
            </div>
            <div v-if="this.type === 'telegram-ro'">
                f
            </div>
            <div v-if="this.type === 'reddit'">
                f
            </div>
            <div v-if="this.type === 'website'">
                f
            </div>

        </div>

    </div>

</template>

<script>

    import consts from "consts/constants"
    import Countdown from 'vuejs-countdown'
    let axios = require('axios');

    export default{

        components: { Countdown },

        data: () => {
            return {

            }
        },

        props:{
            type: {default: ''},
            deadline: {default: ''}
        },

        methods:{

            showRules(){

            }

        }


    }

</script>

<style>
    .error{
        color:red
    }

</style>