/**
* Created by BIT TECHNOLOGIES on 5/28/2017.
*/

<template>

    <HeroCoverSimple url="/" coverColor="white">

        <div slot="header-content" style="text-align: center">

            <h1 class='fg-white' style="margin-top:-10px; display: inline; font-size: 40px; font-weight: bold; text-transform: none; color: #12428c; text-align: center; margin-bottom: 10px; padding-left: 0.5em; padding-right: 0.5em; ">Join Our Communities</h1>


            <div style="margin-bottom: 60px"> </div>

            <div class="row" id="what-is-webdollar">
                <div class="col-md-4">
                    <a href="https://t.me/WebDollar" target="_blank" >
                        <i class="fa fa-telegram" style="font-size: 8em"></i>
                        <h3>Telegram</h3>
                    </a>
                </div>
                <div class="col-md-4">
                    <a href="https://facebook.com/webdollar.io" target="_blank" >
                        <i class="fa fa-facebook-square" style="font-size: 8em"></i>
                        <h3>Facebook</h3>
                    </a>
                </div>
                <div class="col-md-4">
                    <a href="https://github.com/WebDollar" target="_blank" >
                        <i class="fa fa-github-square" style="font-size: 8em"></i>
                        <h3>GitHub</h3>
                    </a>
                </div>
            </div>

            <div style="margin-bottom: 40px"> </div>


        </div>

    </HeroCoverSimple>

</template>


<script>

    import HeroCoverSimple from './HeroCoverSimple.component.vue';

    export default{

        name: 'CommunityCover',

        components: {
            'HeroCoverSimple': HeroCoverSimple,
        },

        params:{

        }

    }
</script>