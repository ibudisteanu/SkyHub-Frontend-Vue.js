/**
* Created by BIT TECHNOLOGIES on 5/28/2017.
*/

<template>


        <HeaverCoverSimple url="/" cover="url('https://lisk.io/i/hero.jpg')" height="400px">

            <div slot="header-content" style="text-align: center; padding-top: 60px">

                <h1 class='fg-white' style="display: inline; font-size: 80px; font-weight: bold; text-transform: none; color: #FFFFFF; text-align: center; margin-bottom: 10px; padding-left: 0.5em; padding-right: 0.5em; ">
                    Wallet in Browser
                </h1>
                <br/> <br/> <br/>

                <h2 class='fg-white' style='display: inline; font-size: 30px; font-weight: bold; text-transform: none; color: #FFFFFF; text-align: center; margin-bottom: 10px; padding-left: 0.5em; padding-right: 0.5em; '>
                    YOUR WALLET IS STORED IN BROWSER
                </h2>

                <img src="/public/res/arrow-animation.gif" style="margin-top:-100px; ms-transform: rotate(270deg);  -webkit-transform: rotate(270deg); transform: rotate(270deg);">

            </div>

        </HeaverCoverSimple>

</template>


<script>

    import HeaverCoverSimple from './HearCoverSimple.component.vue';

    export default{

        name: 'WalletHeaderCover',

        components: {
            'HeaverCoverSimple': HeaverCoverSimple,
        },

        params:{

        }

    }
</script>