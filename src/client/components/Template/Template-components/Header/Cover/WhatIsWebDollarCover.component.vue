/**
* Created by BIT TECHNOLOGIES on 5/28/2017.
*/

<template>

    <HeaverCoverSimple url="/" coverColor="EDEDED">

        <div slot="header-content" style="text-align: center">

            <h1 class='fg-white' style="margin-top:-10px; display: inline; font-size: 40px; font-weight: bold; text-transform: none; color: #12428c; text-align: center; margin-bottom: 10px; padding-left: 0.5em; padding-right: 0.5em; ">What is WebDollar?</h1>


            <div style="margin-bottom: 60px"> </div>

            <div class="row" id="what-is-webdollar">
                <div class="col-md-4">
                    <img style="width: 160px; height:160px; background-color:white; border-radius: 100%; border:11px solid #fff" src="/public/WebDollar-ming.jpg">
                    <p style="padding-top: 20px">
                        <h3>Start <strong>Mining in Browser</strong> in <strong>5 sec</strong></h3>
                        You can start mining WebDollar in just <strong>5 seconds</strong>
                    </p>
                </div>
                <div class="col-md-4">
                    <img style="width: 160px; height:160px; background-color:white; border-radius: 100%; border:11px solid #fff" src="/public/WebDollar-Browser.jpg">
                    <p style="padding-top: 20px">
                    <h3><strong>First Blockchain</strong> in <strong>Browser</strong></h3>
                    WebDollar is the first Blockchain running fully in the Browser <strong>5 seconds</strong>
                    </p>
                </div>
                <div class="col-md-4">
                    <img style="width: 160px; height:160px; background-color:white; border-radius: 100%; border:11px solid #fff" src="/public/WebDollar-wallet.jpg">
                    <p style="padding-top: 20px">
                        <h3><strong>Easiest Blockchain</strong> for <strong>Web Payments</strong></h3>
                        Easiest Blockchain Integration for <strong>Web Payments</strong>
                    </p>
                </div>
            </div>

            <div style="margin-bottom: 40px"> </div>


        </div>

    </HeaverCoverSimple>

</template>


<script>

    import HeaverCoverSimple from './HearCoverSimple.component.vue';

    export default{

        name: 'WhatIsWebDollar',

        components: {
            'HeaverCoverSimple': HeaverCoverSimple,
        },

        params:{

        }

    }
</script>