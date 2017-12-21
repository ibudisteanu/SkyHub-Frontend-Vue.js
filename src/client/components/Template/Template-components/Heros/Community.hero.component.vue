/**
* Created by BIT TECHNOLOGIES on 5/28/2017.
*/

<template>

    <SimpleHero url="/" coverColor="a757ff0f">

        <div slot="hero-content" style="text-align: center">

            <h1 class='fg-white' style="margin-top:-10px; display: inline; font-size: 40px; font-weight: bold; text-transform: none; color: #12428c; text-align: center; margin-bottom: 10px; padding-left: 0.5em; padding-right: 0.5em; ">Join Our Communities</h1>


            <div style="margin-bottom: 60px"> </div>

            <div class="row" id="community" style="width: 100%">
                <div class="col-md-offset-3 col-md-2">
                    <a href="https://t.me/WebDollar" target="_blank" >
                        <i class="fa fa-telegram" style="font-size: 8em"></i>
                        <h3>Telegram</h3>
                    </a>
                </div>
                <div class="col-md-2">
                    <a href="https://facebook.com/webdollar.io" target="_blank" >
                        <i class="fa fa-facebook-square" style="font-size: 8em"></i>
                        <h3>Facebook</h3>
                    </a>
                </div>
                <div class="col-md-2">
                    <a href="https://github.com/WebDollar" target="_blank" >
                        <i class="fa fa-github-square" style="font-size: 8em"></i>
                        <h3>GitHub</h3>
                    </a>
                </div>
            </div>

            <div style="margin-bottom: 40px"> </div>


        </div>

    </SimpleHero>

</template>


<script>

    import SimpleHero from './styles/Simple.hero.component.vue';

    export default{

        name: 'CommunityHero',

        components: {
            'SimpleHero': SimpleHero,
        },

        params:{

        }

    }
</script>