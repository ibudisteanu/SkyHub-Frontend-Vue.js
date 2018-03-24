<template>

    <div class="infoBounty">

        <div class="countDown">
            <div class="verticalAlignMiddle">
                <span class="countDownTitle">{{this.type}} bounty end:</span>
                <countdown :deadline="this.deadline"></countdown>
            </div>
        </div>

        <div class="campaignInfo">


            <span class="infoLine">
                <b>Bounty registration:</b> {{ this.info.type }}
            </span>
            <span class="infoLine">
                <b>Conditions of participation:</b> {{ this.info.requirement }}
            </span>
            <span class="infoLine">
                <b>Score formula:</b> {{this.info.formula}}
            </span>
            <span class="infoLine">
                <b>Ranking Update:</b> {{this.info.update}}
            </span>
            <span class="infoLine">
                <b>Reward:</b> {{this.info.redeem}}
            </span>
            <span class="infoLine">
                <b class="capitalize">{{this.type}} bounty Amount:</b> {{this.info.reward}}
            </span>


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

                youtube:{
                    type: "Automatically",
                    requirement: 'Include "WebDollar" in description and title',
                    formula: "( Views/10 + ThumbsUp - ThumbsDown*3 + Comments*2 )/40",
                    update: "Every 3 minutes",
                    redeem: "To redeem your bounty, you will need to contact the team for providing your wallet Address",
                    reward: "10.000 WEBD",
                },
                facebook:{
                    type: "Register post link",
                    requirement: 'Include WebDollar in the content',
                    formula: " (Likes + 3*shares + 1.5*comments)/30",
                    update: "Every 3 minutes",
                    redeem: "To redeem your bounty, you will need to contact the team for providing your wallet Address",
                    reward: "10.000 WEBD",
                },
                instagram:{
                    type: "Automatically",
                    requirement: 'Include #WebDollar in post',
                    formula: " (Likes + 3*shares + 1.5*comments)/30",
                    update: "Every 3 minutes",
                    redeem: "To redeem your bounty, you will need to contact the team for providing your wallet Address",
                    reward: "10.000 WEBD",
                },
                twitter:{
                    type: "Automatically",
                    requirement: 'Include #WebDollar in post',
                    formula: " (Followers/100 + Friends/100 + Likes + Shares*5 + Comments*2)/10",
                    update: "Every 3 minutes",
                    redeem: "To redeem your bounty, you will need to contact the team for providing your wallet Address",
                    reward: "10.000 WEBD",
                },
                telegram:{
                    type: "Automatically",
                    requirement: 'Be a member in the group',
                    formula: " (Messages/100 + Invitations) ",
                    update: "Every day",
                    redeem: "To redeem your bounty, you will need to contact the team for providing your wallet Address",
                    reward: "10.000 WEBD",
                },
                telegramRO:{
                    type: "Automatically",
                    requirement: 'Be a member in the group',
                    formula: " (Messages/100 + Invitations) ",
                    update: "Every day",
                    redeem: "To redeem your bounty, you will need to contact the team for providing your wallet Address",
                    reward: "10.000 WEBD",
                },
                reddit:{
                    type: "Automatically",
                    requirement: 'Discus on the /r/WebDollar subreddit',
                    formula: " (RedditScore*2 + comments)/10 ",
                    update: "Every 3 minutes",
                    redeem: "To redeem your bounty, you will need to contact the team for providing your wallet Address",
                    reward: "10.000 WEBD",
                },
                website:{
                    type: "Automatically",
                    requirement: 'Discus on the WebDollar in Title and Description',
                    formula: " Google PageRank + Score*2 ",
                    update: "Every day",
                    redeem: "To redeem your bounty, you will need to contact the team for providing your wallet Address",
                    reward: "10.000 WEBD",
                },

            }
        },

        computed:{

            info(){

                if (this.type !== '')
                    return this[this.type];
            }

        },

        props:{
            type: {default: ''},
            deadline: {default: ''}
        },

        methods:{

        }


    }

</script>

<style>
    .error{
        color:red
    }

</style>