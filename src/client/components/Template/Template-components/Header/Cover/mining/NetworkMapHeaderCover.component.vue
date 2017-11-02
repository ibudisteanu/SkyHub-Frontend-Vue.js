/**
* Created by BIT TECHNOLOGIES on 5/28/2017.
*/

<template>


        <HeroCoverSimple url="/" coverColor="white" height="300px" style="padding-bottom: 0">

            <div slot="header-content" style="text-align: center">

                <h1 class='fg-white' style="font-size: 60px; font-weight: bold; text-transform: none; color: #12428c; text-align: center; margin-bottom: 50px; padding-left: 0.5em; padding-right: 0.5em; ">
                    Peer-to-Peer Network
                </h1>

                <div id="map" style="height: 500px; margin-left: -35px; margin-right: -35px; margin-bottom: 0"></div>
                <script  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB3RtAgqpzLTzj5zKs3z-83RUDZYmvlsCc"> </script>

            </div>

        </HeroCoverSimple>


</template>


<script>

    import HeroCoverSimple from '../HeroCoverSimple.component.vue';

    export default{

        name: 'MiningHeaderCover',

        components: {
            'HeroCoverSimple': HeroCoverSimple,
        },

        mounted(){
            if (this.$isServer) return false;

            $(window).resize(function () {
                $('#map').css('height', 500);
            }).resize();

            this.googleMapsInitialize();

        },

        data: function () {
            return {


            }
        },

        props:{

        },

        methods:{

            googleMapsInitialize() {
                NetworkMap.createMap('map');
                NetworkMap.initialize(map);
                NetworkMap.initializePolylines(map);
            }

        }

    }
</script>