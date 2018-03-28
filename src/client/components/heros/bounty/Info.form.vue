<template>

    <div class="infoBounty" :class="this.showSubscription ? 'infoBountyPlus' : ''">

        <div class="countDown">
            <div class="verticalAlignMiddle">
                <span class="countDownTitle">{{this.type}} bounty end:</span>

                <!--<countdown :deadline="this.info.deadline" ></countdown>-->


                <ul class="vuejs-countdown" v-if="this.message === ''">
                    <li>
                        <p class="digit">{{d}}</p>
                        <p class="text">days</p>
                    </li>
                    <li>
                        <p class="digit">{{h}}</p>
                        <p class="text">hours</p>
                    </li>
                    <li>
                        <p class="digit">{{m}}</p>
                        <p class="text">min</p>
                    </li>
                    <li>
                        <p class="digit">{{s}}</p>
                        <p class="text">Sec</p>
                    </li>
                </ul>

                <span class="finishedCount" v-if="this.message !== ''">
                    {{message}}
                </span>



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
                <b>Scoring formula:</b> {{this.info.formula}}
            </span>
            <span class="infoLine">
                <div v-if="this.info.update == ''">
                    <b>Next list update:</b> {{this.refreshCountDownSeconds + ' seconds left'}}
                </div>
                <div v-if="this.info.update != ''">
                    <b>Next list update:</b> {{this.info.update}}
                </div>
            </span>
            <span class="infoLine">
                <b>Obtain the reward:</b> {{this.info.redeem}}
            </span>
            <span class="infoLine">
                <b class="capitalize">{{this.type}} bounty Amount:</b> {{this.info.reward}}
            </span>

        </div>

        <submit-link class="submitLink" v-if="this.showSubscription" :type="this.type" @onLinkSubmitted="this.onLinkSubmitted"> </submit-link>

    </div>

</template>

<script>

    import consts from "consts/constants"
    import SubmitLink from "./Submit-Link.form.vue";
    import countdown from "client/components/UI/elements/Countdown.component.vue"

    let axios = require('axios');

    export default{

        components: {
            countdown,
            SubmitLink
        },

        data: () => {

            let commonDeadline = 'April 2, 2018 00:00';

            return {

                refreshCountDownSeconds: 0,

                youtube:{
                    type: "Automatically",
                    requirement: 'Include "WebDollar" in description and title',
                    formula: "( Views/10 + ThumbsUp - ThumbsDown*3 + Comments*2 )/40",
                    update: "",
                    redeem: "At the end of the bounty campaign period, please send a email to bounties@webdollar.io with the post link and your position in the list and after the launch of the main net you will receive the reward",
                    reward: "10.000 WEBD",
                    deadline: commonDeadline,
                },
                facebook:{
                    type: "Register post link",
                    requirement: 'Include WebDollar in the content',
                    formula: " (Likes + 3*shares + 1.5*comments)/30",
                    update: "",
                    redeem: "At the end of the bounty campaign period, please send a email to bounties@webdollar.io with the post link and your position in the list and after the launch of the main net you will receive the reward",
                    reward: "10.000 WEBD",
                    deadline: commonDeadline,
                },
                instagram:{
                    type: "Automatically",
                    requirement: 'Include #WebDollar in post',
                    formula: " (Likes + 2*comments)/10",
                    update: "",
                    redeem: "At the end of the bounty campaign period, please send a email to bounties@webdollar.io with the post link and your position in the list and after the launch of the main net you will receive the reward",
                    reward: "5.000 WEBD",
                    deadline: commonDeadline,
                },
                twitter:{
                    type: "Automatically",
                    requirement: 'Include #WebDollar in post',
                    formula: " (Followers/100 + Friends/100 + Likes + Shares*5 + Comments*2)/10",
                    update: "",
                    redeem: "At the end of the bounty campaign period, please send a email to bounties@webdollar.io with the post link and your position in the list and after the launch of the main net you will receive the reward",
                    reward: "15.000 WEBD",
                    deadline: commonDeadline,
                },
                telegram:{
                    type: "Automatically",
                    requirement: 'Be a member in the group, promote meaningful conversations and invite people (maximum 2 at a time)',
                    formula: " (Messages/100 + Invitations) ",
                    update: "Every day",
                    redeem: "At the end of the bounty campaign period, please send a email to bounties@webdollar.io with the post link and your position in the list and after the launch of the main net you will receive the reward",
                    reward: "20.000 WEBD",
                    deadline: commonDeadline,
                },
                "telegram RO":{
                    type: "Automatically",
                    requirement: 'Be a member in the group, promote meaningful conversations and invite people (maximum 2 at a time)',
                    formula: " (Messages/100 + Invitations) ",
                    update: "Every day",
                    redeem: "At the end of the bounty campaign period, please send a email to bounties@webdollar.io with the post link and your position in the list and after the launch of the main net you will receive the reward",
                    reward: "5.000 WEBD",
                    deadline: commonDeadline,
                },
                reddit:{
                    type: "Automatically",
                    requirement: 'Discus on the /r/WebDollar subreddit',
                    formula: " (RedditScore*2 + comments)/10 ",
                    update: "",
                    redeem: "At the end of the bounty campaign period, please send a email to bounties@webdollar.io with the post link and your position in the list and after the launch of the main net you will receive the reward",
                    reward: "10.000 WEBD",
                    deadline: commonDeadline,
                },
                website:{
                    type: "Automatically",
                    requirement: 'Discus on the WebDollar in Title and Description',
                    formula: " Google PageRank + Score*2 ",
                    update: "",
                    redeem: "At the end of the bounty campaign period, please send a email to bounties@webdollar.io with the post link and your position in the list and after the launch of the main net you will receive the reward",
                    reward: "1.000 WEBD",
                    deadline: commonDeadline,
                },


                interval: undefined,

                d: 0,
                h: 0,
                m: 0,
                s: 0,
                message: '',

            }
        },

        computed: {

            info() {

                let answer;
                if (this.type !== '')
                    answer = this[this.type];

                if (answer === undefined)
                    answer = this.youtube;

                return answer;
            },

            showSubscription() {

                if (this.type !== 'reddit' && this.type !== 'instagram' && this.type !== 'telegram' && this.type !== 'telegram RO' && this.type !== 'twitter' && this.type !== 'youtube')
                    return true;

                return false;

            },

        },

        props:{
            type: {default: ''},
            onLinkSubmitted: {default: ()=>{}},
            deadline : {default: "Sep 5, 2018 15:37:25" },
        },

        methods:{

            countDown(){

                let countDownDate = new Date(this.info.deadline).getTime();

                // Get todays date and time
                let now = new Date().getTime();

                // Find the distance between now an the count down date
                let distance = countDownDate - now;

                // Time calculations for days, hours, minutes and seconds
                this.d = Math.floor(distance / (1000 * 60 * 60 * 24));
                this.h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                this.m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                this.s = Math.floor((distance % (1000 * 60)) / 1000);

                // Estetic redefine
                if (this.h < 10)
                    this.h = '0' + this.h;

                if (this.d < 10)
                    this.d = '0' + this.d;

                if (this.m < 10)
                    this.m = '0' + this.m;

                if (this.s < 10)
                    this.s = '0' + this.s;

                // If the count down is finished, write some text
                if (distance < 0) {
                    clearInterval(this.interval);
                    this.interval = undefined;
                    this.message = 'FINISHED';
                }

            }


        },

        mounted(){

            if (typeof window === "undefined") return false;

            setInterval(()=>{

                // Get todays date and time
                let now = new Date().getTime();
                // Find the distance between now an the count down date
                let distance = this.$store.state.global.bountyCountDownDateFetchingNewList - now;

                this.refreshCountDownSeconds = Math.max(0, Math.floor((distance % (1000 * 60)) / 1000));

            }, 1000);


            // Update the count down every 1 second
            if (this.interval !== undefined)
                clearInterval(this.interval);

            this.interval = setInterval( this.countDown, 1000);

            this.countDown();


        }


    }

</script>

<style>
    .error{
        color:red
    }

</style>