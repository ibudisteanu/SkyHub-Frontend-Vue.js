<template>

    <div >

        <div id="newsletterSection" class="backgroundSection">

            <span class="pageTitle alignCenter titleMarginBottom removeBackground">Newsletter</span>
            <div id="newsletterContainer">

                <span CLASS="newsletterText">Subscribe to our newsletter</span>

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

                let answer = await axios.post(consts.SERVER_API+"subscribe-newsletter",{email: this.email});

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