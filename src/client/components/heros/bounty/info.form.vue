<template>

    <div class="info">

        <span class="countDownTitle">{{this.type}} bounty end:</span>

        <template>
            <div class="countDown">
                <countdown :deadline="this.deadline"></countdown>
            </div>
        </template>

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

        }


    }

</script>

<style>
    .error{
        color:red
    }

</style>