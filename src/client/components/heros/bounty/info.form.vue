<template>

    <div class="infoBounty">

        <div class="countDown">
            <div class="verticalAlignMiddle">
                <span class="countDownTitle">{{this.type}} bounty end:</span>
                <countdown :deadline="this.deadline"></countdown>
            </div>
        </div>

        <div class="campaignInfo">

            <div v-if="this.type === 'youtube'">

                 <span class="infoLine">
                    <b>Bounty registration:</b> Automatically
                </span>
                <span class="infoLine">
                    <b>Conditions of participation:</b> Containing WebDollar/webd in description and content
                </span>
                <span class="infoLine">
                    <b>Score formula:</b> (Views/10 + ThumbsUp - ThumbsDown*3 + Comments*2)/40
                </span>
                <span class="infoLine">
                    <b>Reward:</b> You will be contacted by our team for providing your wallet Address
                </span>

            </div>
            <div v-if="this.type === 'facebook'">

                <span class="infoLine">
                    <b>Bounty registration:</b> Register post link
                </span>
                <span class="infoLine">
                    <b>Conditions of participation:</b> Containing WebDollar/webd in description and content
                </span>
                <span class="infoLine">
                    <b>Score formula:</b> (Likes + 3*shares + 1.5*comments)/30
                </span>
                <span class="infoLine">
                    <b>Reward:</b> You will be contacted by our team for providing your wallet Address
                </span>

            </div>
            <div v-if="this.type === 'instagram'">

                <span class="infoLine">
                    <b>Bounty registration:</b> Automatically
                </span>
                <span class="infoLine">
                    <b>Conditions of participation:</b> Containing #WebDollar in post
                </span>
                <span class="infoLine">
                    <b>Score formula:</b> (Likes + 2*comments)/10
                </span>
                <span class="infoLine">
                    <b>Reward:</b> You will be contacted by our team for providing your wallet Address
                </span>

            </div>
            <div v-if="this.type === 'twitter'">

                <span class="infoLine">
                    <b>Bounty registration:</b> Automatically
                </span>
                <span class="infoLine">
                    <b>Conditions of participation:</b> Containing WebDollar/webd in post
                </span>
                <span class="infoLine">
                    <b>Score formula:</b> (Followers/100 + Friends/100 + Likes + Shares*5 + Comments*2)/10
                </span>
                <span class="infoLine">
                    <b>Reward:</b> You will be contacted by our team for providing your wallet Address
                </span>

            </div>
            <div v-if="this.type === 'telegram'">

                <span class="infoLine">
                    <b>Bounty registration:</b> Automatically
                </span>
                <span class="infoLine">
                    <b>Conditions of participation:</b> Be a member in the group
                </span>
                <span class="infoLine">
                    <b>Score formula:</b> (Messages/100 + Invitations)
                </span>
                <span class="infoLine">
                    <b>Reward:</b> You will be contacted by our team for providing your wallet Address
                </span>

            </div>
            <div v-if="this.type === 'telegram RO'">

                <span class="infoLine">
                    <b>Bounty registration:</b> Automatically
                </span>
                <span class="infoLine">
                    <b>Conditions of participation:</b> Be a member in the group
                </span>
                <span class="infoLine">
                    <b>Score formula:</b> (Messages/100 + Invitations)
                </span>
                <span class="infoLine">
                    <b>Reward:</b> You will be contacted by our team for providing your wallet Address
                </span>

            </div>
            <div v-if="this.type === 'reddit'">

                <span class="infoLine">
                    <b>Bounty registration:</b> Automatically
                </span>
                <span class="infoLine">
                    <b>Conditions of participation:</b> Containing WebDollar/webd in description and content
                </span>
                <span class="infoLine">
                    <b>Score formula:</b> (Likes + 3*shares + 1.5*comments)/30
                </span>
                <span class="infoLine">
                    <b>Reward:</b> You will be contacted by our team for providing your wallet Address
                </span>

            </div>
            <div v-if="this.type === 'website'">

                <span class="infoLine">
                    <b>Bounty registration:</b> Automatically
                </span>
                <span class="infoLine">
                    <b>Conditions of participation:</b> Containing WebDollar/webd in description and content
                </span>
                <span class="infoLine">
                    <b>Score formula:</b> (Likes + 3*shares + 1.5*comments)/30
                </span>
                <span class="infoLine">
                    <b>Reward:</b> You will be contacted by our team for providing your wallet Address
                </span>

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