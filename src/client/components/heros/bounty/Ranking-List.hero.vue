<template>

    <div class="bountyPage">

        <div class="bountySide">

            <div class="bountyCampains">
                <span @click="this.handleChangeToYoutube" :class="this.type==='youtube' ? 'selectedCampaign' : ''">Youtube</span>
                <span @click="this.handleChangeToFacebook" :class="this.type==='facebook' ? 'selectedCampaign' : ''">Facebook</span>
                <span @click="this.handleChangeToInstagram" :class="this.type==='instagram' ? 'selectedCampaign' : ''">Instagram</span>
                <span @click="this.handleChangeToTwitter" :class="this.type==='twitter' ? 'selectedCampaign' : ''">Twitter</span>
                <span @click="this.handleChangeToTelegramWebDollar" :class="this.type==='telegram' ? 'selectedCampaign' : ''">Telegram</span>
                <span @click="this.handleChangeToTelegramWebDollarRO" :class="this.type==='telegram RO' ? 'selectedCampaign' : ''">Telegram RO</span>
                <span @click="this.handleChangeToReddit" :class="this.type==='reddit' ? 'selectedCampaign' : ''">Reddit</span>
                <span @click="this.handleChangeToWebsite" :class="this.type==='website' ? 'selectedCampaign' : ''">Websites</span>
            </div>

            <submit-link class="submitLink" v-if="this.type !== 'reddit' && this.type !== 'instagram' && this.type !== 'telegram' && this.type !== 'telegram RO' && this.type !== 'Telegram-WebDollarRO' && this.type !== 'twitter' && this.type !== 'youtube' " :type="this.type"  @onLinkSubmitted="this.linkSubmitted"> </submit-link>

        </div>
        <div class="bountyMain">

            <div class="bountySideScroll">
                <div class="error" v-html="this.error"></div>
                <info-link class="infoLink" :type="this.type" :deadline="this.deadline"> </info-link>
            </div>

            <facebook-ranking-list v-if="this.type === 'facebook'" :list="this.sortedArray" :type="this.type" ></facebook-ranking-list>
            <youtube-ranking-list v-if="this.type === 'youtube'" :list="this.sortedArray" :type="this.type" ></youtube-ranking-list>
            <instagram-ranking-list v-if="this.type === 'instagram'" :list="this.sortedArray" :type="this.type" ></instagram-ranking-list>
            <twitter-ranking-list v-if="this.type === 'twitter'" :list="this.sortedArray" :type="this.type" ></twitter-ranking-list>
            <telegram-ranking-list v-if="this.type === 'telegram'" :list="this.sortedArray" :type="this.type" ></telegram-ranking-list>
            <telegram-ranking-list v-if="this.type === 'telegram RO'" :list="this.sortedArray" :type="this.type" ></telegram-ranking-list>
            <reddit-ranking-list v-if="this.type === 'reddit'" :list="this.sortedArray" :type="this.type" ></reddit-ranking-list>
            <website-ranking-list v-if="this.type === 'website'" :list="this.sortedArray" :type="this.type" ></website-ranking-list>

        </div>

    </div>

</template>

<script>

    import RedditRankingList from "./lists/Reddit-Ranking-List.vue"
    import InstagramRankingList from "./lists/Instagram-Ranking-List.vue"
    import YoutubeRankingList from "./lists/Youtube-Ranking-List.vue"
    import FacebookRankingList from "./lists/Facebook-Ranking-List.vue"
    import TwitterRankingList from "./lists/Twitter-Ranking-List.vue"
    import TelegramRankingList from "./lists/Telegram-Ranking-List.vue"
    import WebsiteRankingList from "./lists/Telegram-Ranking-List.vue"

    import SubmitLink from "./Submit-Link.form.vue";
    import InfoLink from "./info.form.vue"
    import consts from "consts/constants";
    import Vue from 'vue'
    let axios = require('axios');

    export default{

        data: () => {
            return {
                type: 'youtube',
                error: '',
                list: {},
                page:0,
                deadline:'March 31, 2018'
                //deadline:'March 31, 2018'
            }
        },

        components:{
            YoutubeRankingList,
            FacebookRankingList,
            TwitterRankingList,
            TelegramRankingList,
            WebsiteRankingList,
            InstagramRankingList,
            RedditRankingList,
            SubmitLink,
            InfoLink
        },

        methods:{
            linkSubmitted (link){
                Vue.set(this.list, link.id, link);
            },

            async downloadList(page=0){

                if (page === undefined)
                    page = 0;

                let answer = await axios.get(consts.SERVER_API+"get-ranking/"+this.type+"/"+page);

                answer = answer.data;

                if (answer.result){

                    for (let i=0; i<answer.data.length; i++)
                        Vue.set(this.list, answer.data[i].id, answer.data[i])

                    this.error = '';
                } else {
                    this.error = answer.message;
                }

            },

            handleChangeType(type){

                if (this.type !== type){

                    this.type = type;
                    this.page = 0;
                    this.list = {};

                    this.downloadList(this.page);
                }

            },

            handleChangeToReddit(){ this.handleChangeType('reddit')},
            handleChangeToInstagram(){ this.handleChangeType('instagram')},
            handleChangeToYoutube(){ this.handleChangeType('youtube')},
            handleChangeToFacebook(){ this.handleChangeType('facebook')},
            handleChangeToTwitter(){ this.handleChangeType('twitter')},
            handleChangeToTelegramWebDollar(){ this.handleChangeType('telegram')},
            handleChangeToTelegramWebDollarRO(){ this.handleChangeType('telegram RO')},
            handleChangeToWebsite(){ this.handleChangeType('website')},

            async fetchNewData(){

                await this.downloadList(this.page);

                setTimeout( ()=>{
                    this.fetchNewData();
                }, 60*1000);

            }
        },

        mounted(){

            if (typeof window === "undefined") return false;

            this.fetchNewData();

        },


        computed: {
            sortedArray: function() {

                function compare(a, b) {
                    return - (a.score - b.score);
                }

                let sortable = [];
                for (let list in this.list)
                    sortable.push(this.list[list]);

                return sortable.sort(compare);
            }
        },

    }
</script>

<style>

    .error{
        color:red;
    }

</style>