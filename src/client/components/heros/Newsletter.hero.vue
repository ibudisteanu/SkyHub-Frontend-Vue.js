<template>

    <div >

        <a id="newsletter"> </a>
        <div id="newsletterSection" class="backgroundSection">

            <span class="pageTitle alignCenter titleMarginBottom removeBackground">Follow us</span>

            <div class="socialLinksNewsletter">
                <a href="https://facebook.com/webdollar.io" target="_blank">
                    <i class="fa fa-facebook2 socialLinkWEBD"></i>
                </a>
                <a href="https://twitter.com/webdollar_io" target="_blank">
                    <i class="fa fa-twitter socialLinkWEBD"></i>
                </a>
                <a href="https://t.me/WebDollar" target="_blank">
                    <i class="fa fa-telegram socialLinkWEBD"></i>
                </a>
                <a href="https://github.com/WebDollar" target="_blank">
                    <i class="fa fa-github socialLinkWEBD"></i>
                </a>
                <a href="https://www.reddit.com/r/webdollar/" target="_blank">
                    <i class="fa fa-reddit-alien socialLinkWEBD"></i>
                </a>
                <a href="https://medium.com/@webdollar" target="_blank">
                    <i class="fa fa-medium socialLinkWEBD"></i>
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