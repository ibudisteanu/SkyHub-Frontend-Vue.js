/**
 * Created by BIT TECHNOLOGIES on 5/28/2017.
 */

<template>

    <HeaverCoverSimple url="/" cover="url('http://i.imgur.com/hqLGii9.jpg')" height="400px">

        <div slot="header-content" style="text-align: center; margin-top: 100px;">

            <h1 class='fg-white' style="display: inline; font-size: 80px; font-weight: bold; text-transform: none; color: #FFFFFF; text-align: center; margin-bottom: 10px; padding-left: 0.5em; padding-right: 0.5em; background-color: rgba(0, 0, 12, 0.75); ">WebDollar.io</h1>
            <br/> <br/> <br/>

            <h2 class='fg-white' style='display: inline; font-size: 30px; font-weight: bold; text-transform: none; color: #FFFFFF; text-align: center; margin-bottom: 10px; padding-left: 0.5em; padding-right: 0.5em; background-color: rgba(0, 0, 12, 0.75); '>
                BLOCKCHAIN DIRECTLY IN BROWSER
            </h2>

        </div>

    </HeaverCoverSimple>

</template>


<script>

    import HeaverCoverSimple from './HearCoverSimple.component.vue';

    export default{

        name: 'WebsiteHeaderCover',

        components: {
            'HeaverCoverSimple': HeaverCoverSimple,
        },

        params:{

        }

    }
</script>