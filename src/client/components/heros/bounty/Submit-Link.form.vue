<template>

    <div class="register">

        <h2>Add New {{this.type}} link</h2>

        <div class="inputs">
            <input placeholder="Promote Link URL" type="text" v-model="url"><br>
            <!--<input placeholder="Rewarded Address" type="text" v-model="walletAddress" ><br>-->

            <div class="error" v-html="this.error">
            </div>

        </div>

        <button type="submit" @click="this.sendLink">Participate</button>

    </div>

</template>

<script>

    import consts from "consts/constants";
    let axios = require('axios');

    export default{

        data: () => {
            return {
                url:'',
                walletAddress:'',
                error: '',
            }
        },

        props:{
            type: {default: ''},
            onLinkSubmitted: {default: ()=>{}},
        },

        //@onLinkSubmitted

        methods:{
            async sendLink(){

                let answer = await axios.post(consts.SERVER_API+"scrape-new-link", {
                    type: this.type,
                    url: this.url,
                    walletAddress: this.walletAddress
                });

                answer = answer.data;

                console.log(answer);

                if (answer.result){
                    this.$emit('onLinkSubmitted', answer.newLink );
                    this.error = '';
                } else {
                    this.error = answer.message;
                }

            }
        }


    }

</script>

<style>
    .error{
        color:red
    }

</style>