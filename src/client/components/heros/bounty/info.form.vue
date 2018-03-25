<template>

    <div class="infoBounty" :class="this.showSubscription === 'yes' ? 'infoBountyPlus' : ''">

        <div class="countDown">
            <div class="verticalAlignMiddle">
                <span class="countDownTitle">{{this.type}} bounty end:</span>
                <countdown :deadline="this.info.deadline" ></countdown>
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
                <div v-if="this.info.update == ''">
                    <b>List Update:</b> {{this.refreshCountDownSeconds + ' seconds left'}}
                </div>
                <div v-if="this.info.update != ''">
                    <b>List Update:</b> {{this.info.update}}
                </div>
            </span>
            <span class="infoLine">
                <b>Reward:</b> {{this.info.redeem}}
            </span>
            <span class="infoLine">
                <b class="capitalize">{{this.type}} bounty Amount:</b> {{this.info.reward}}
            </span>

        </div>

        <submit-link class="submitLink" v-if="this.showSubscription == 'yes'" :type="this.type" @onLinkSubmitted="this.onLinkSubmitted"> </submit-link>

    </div>

</template>

<script>

    import consts from "consts/constants"
    import SubmitLink from "./Submit-Link.form.vue";
    import countdown from "client/components/UI/elements/Countdown.component.vue"

    let axios = require('axios');

    export default{

        components: { countdown,
            SubmitLink
        },

        data: () => {

            return {

                refreshCountDownSeconds: 0,

                youtube:{
                    type: "Automatically",
                    requirement: 'Include "WebDollar" in description and title',
                    formula: "( Views/10 + ThumbsUp - ThumbsDown*3 + Comments*2 )/40",
                    update: "",
                    redeem: "To redeem your bounty, you'll need to contact the team for providing your wallet Address after main net",
                    reward: "10.000 WEBD",
                    deadline: 'April 1, 2018 00:00',
                },
                facebook:{
                    type: "Register post link",
                    requirement: 'Include WebDollar in the content',
                    formula: " (Likes + 3*shares + 1.5*comments)/30",
                    update: "",
                    redeem: "To redeem your bounty, you'll need to contact the team for providing your wallet Address after main net",
                    reward: "10.000 WEBD",
                    deadline: 'April 1, 2018 00:00',
                },
                instagram:{
                    type: "Automatically",
                    requirement: 'Include #WebDollar in post',
                    formula: " (Likes + 3*shares + 1.5*comments)/30",
                    update: "",
                    redeem: "To redeem your bounty, you'll need to contact the team for providing your wallet Address after main net",
                    reward: "10.000 WEBD",
                    deadline: 'April 1, 2018 00:00',
                },
                twitter:{
                    type: "Automatically",
                    requirement: 'Include #WebDollar in post',
                    formula: " (Followers/100 + Friends/100 + Likes + Shares*5 + Comments*2)/10",
                    update: "",
                    redeem: "To redeem your bounty, you'll need to contact the team for providing your wallet Address after main net",
                    reward: "10.000 WEBD",
                    deadline: 'April 1, 2018 00:00',
                },
                telegram:{
                    type: "Automatically",
                    requirement: 'Be a member in the group, Write messages and Invite 2 by 2 people',
                    formula: " (Messages/100 + Invitations) ",
                    update: "Every day",
                    redeem: "To redeem your bounty, you'll need to contact the team for providing your wallet Address after main net",
                    reward: "10.000 WEBD",
                    deadline: 'April 1, 2018 00:00',
                },
                telegramRO:{
                    type: "Automatically",
                    requirement: 'Be a member in the group, Write messages and Invite 2 by 2 people',
                    formula: " (Messages/100 + Invitations) ",
                    update: "Every day",
                    redeem: "To redeem your bounty, you'll need to contact the team for providing your wallet Address after main net",
                    reward: "10.000 WEBD",
                    deadline: 'April 1, 2018 00:00',
                },
                reddit:{
                    type: "Automatically",
                    requirement: 'Discus on the /r/WebDollar subreddit',
                    formula: " (RedditScore*2 + comments)/10 ",
                    update: "",
                    redeem: "To redeem your bounty, you will need to contact the team for providing your wallet Address after main net",
                    reward: "10.000 WEBD",
                    deadline: 'April 1, 2018 00:00',
                },
                website:{
                    type: "Automatically",
                    requirement: 'Discus on the WebDollar in Title and Description',
                    formula: " Google PageRank + Score*2 ",
                    update: "",
                    redeem: "To redeem your bounty, you will need to contact the team for providing your wallet Address after main net",
                    reward: "10.000 WEBD",
                    deadline: 'April 1, 2018 00:00',
                },

            }
        },

        computed: {

            info() {

                if (this.type !== '')
                    return this[this.type];
                else
                    return this.youtube;
            },

            showSubscription() {

                if (this.type !== 'reddit' && this.type !== 'instagram' && this.type !== 'telegram' && this.type !== 'telegram RO' && this.type !== 'twitter' && this.type !== 'youtube'){
                    return 'yes'
                }else{
                    return 'no'
                }

            },

        },

        props:{
            type: {default: ''},
            onLinkSubmitted: {default: ()=>{} }
        },

        methods:{



        },

        mounted(){

            setInterval(()=>{

                // Get todays date and time
                let now = new Date().getTime();
                // Find the distance between now an the count down date
                let distance = this.$store.state.global.bountyCountDownDateFetchingNewList - now;

                this.refreshCountDownSeconds = Math.max(0, Math.floor((distance % (1000 * 60)) / 1000));

            }, 1000);

        }


    }

</script>

<style>
    .error{
        color:red
    }

</style>