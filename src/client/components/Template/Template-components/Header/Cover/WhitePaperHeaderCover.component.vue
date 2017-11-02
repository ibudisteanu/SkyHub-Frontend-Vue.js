/**
* Created by BIT TECHNOLOGIES on 5/28/2017.
*/

<template>

    <HeroCoverSimple url="/" coverColor="white" height="250px">

        <div slot="header-content" style="text-align: center">

            <h1 class='fg-white' style="display: inline; font-size: 40px; font-weight: bold; text-transform: none; color: #12428c; text-align: center; margin-bottom: 10px; padding-left: 0.5em; padding-right: 0.5em; ">White Paper</h1>
            <br/> <br/> <br/>

            <a href="/public/WebDollar-White-Paper.pdf" target="_blank">
                <button type="button" class="btn btn-primary" style="padding: 10px ;  border-radius: 5px; font-size: 14px; background-color: #482cbd; color: #fff; text-shadow: none; background-image: none;">
                    <i class="fa fa-download" style="color:white; margin-right: 10px" /> <b style="color:white">Get White Paper</b>
                </button>
            </a>


        </div>

    </HeroCoverSimple>

</template>


<script>

    import HeroCoverSimple from './HeroCoverSimple.component.vue';

    export default{

        name: 'WhitePaperHeaderCover',

        components: {
            'HeroCoverSimple': HeroCoverSimple,
        },

        params:{

        }

    }
</script>