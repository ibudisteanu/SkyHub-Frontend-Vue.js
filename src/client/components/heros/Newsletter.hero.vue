<template>

    <div >

        <a id="newsletter"> </a>
        <div id="newsletterSection" class="backgroundSection">

            <span class="pageTitle alignCenter titleMarginBottom removeBackground">Follow us</span>

            <div class="socialLinksNewsletter">
                <a href="https://facebook.com/webdollar.io" target="_blank" class="linkIconSocial">
                    <img src="/public/assets/images/SocialMedia/facebook_white.png" alt="facebook" class="linkIconSocialNormal">
                    <img src="/public/assets/images/SocialMedia/facebook_yellow.png" alt="facebook" class="linkIconSocialHover">
                </a>
                <a href="https://twitter.com/webdollar_io" target="_blank" class="linkIconSocial">
                    <img src="/public/assets/images/SocialMedia/twitter_white.png" alt="twitter" class="linkIconSocialNormal">
                    <img src="/public/assets/images/SocialMedia/twitter_yellow.png" alt="twitter" class="linkIconSocialHover">
                </a>
                <a href="https://t.me/WebDollar" target="_blank" class="linkIconSocial">
                    <img src="/public/assets/images/SocialMedia/telegram_white.png" alt="telegram" class="linkIconSocialNormal">
                    <img src="/public/assets/images/SocialMedia/telegram_yellow.png" alt="telegram" class="linkIconSocialHover">
                </a>
                <a href="https://github.com/WebDollar" target="_blank" class="linkIconSocial">
                    <img src="/public/assets/images/SocialMedia/github_white.png" alt="github" class="linkIconSocialNormal">
                    <img src="/public/assets/images/SocialMedia/github_yellow.png" alt="github" class="linkIconSocialHover">
                </a>
                <a href="https://www.reddit.com/r/webdollar/" target="_blank"  class="linkIconSocial">
                    <img src="/public/assets/images/SocialMedia/reddit_white.png" alt="reddit" class="linkIconSocialNormal">
                    <img src="/public/assets/images/SocialMedia/reddit_yellow.png" alt="reddit" class="linkIconSocialHover">
                </a>
                <a href="https://medium.com/@webdollar" target="_blank" class="linkIconSocial">
                    <img src="/public/assets/images/SocialMedia/medium_white.png" alt="medium" class="linkIconSocialNormal">
                    <img src="/public/assets/images/SocialMedia/medium_yellow.png" alt="medium" class="linkIconSocialHover">
                </a>
            </div>

            <div id="newsletterContainer">

                <span class="newsletterText">Subscribe to our newsletter for the latest news</span>

                <div v-if="this.success === ''" >
                    <input v-model="email" placeholder="Email"  />

                    <span class="error">
                        {{this.error}}
                    </span>

                    <span class="websiteButton" @click="subscribeEmail">Subscribe</span>
                </div>

                <div class="success" v-if="this.success !== ''">
                    {{this.success}}
                </div>

            </div>

        </div>

    </div>

</template>

<script>

    const axios = require('axios');
    import consts from "consts/constants";

    export default{

        data:()=>{
            return {
                email: '',
                error:'',
                success: '',
            }
        },

        methods:{

            async subscribeEmail(){

                let answer;
                try {
                    answer = await axios.post(consts.SERVER_API + "subscribe-newsletter", {email: this.email});
                } catch (exception){

                    this.error = "There is a problem subscribing to newsletter";
                    return false;

                }

                answer = answer.data;

                if (answer.result === false){
                    this.error = answer.message;
                    this.success = '';
                } else {
                    this.error = '';
                    this.success = answer.message;
                }

            }

        }

    }

</script>

<style>

    .socialLinksNewsletter{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        max-width: 500px;
        margin: 0 auto;
        margin-bottom: 50px;
    }

    .linkIconSocial img{
        width: 50px;
        display: block;
        margin: 0 auto;
        margin-top: 20px;
        transition: margin 0.5s ease;
    }

    .linkIconSocial .linkIconSocialHover{
        display: none;
    }

    .linkIconSocial:hover .linkIconSocialHover{
        display: block;
        margin-top: 0;
        transition: margin 0.5s ease;
    }

    .linkIconSocial:hover .linkIconSocialNormal{
        display: none;
    }

    #newsletterContainer input{
        transition: all 0.5s ease;
    }

    #newsletterContainer input:focus{
        border: solid 1px #8c8c8c;
        background-color: #000000;
        transition: all 0.5s ease;
    }

</style>