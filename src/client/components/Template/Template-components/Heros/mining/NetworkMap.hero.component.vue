/**
* Created by BIT TECHNOLOGIES on 5/28/2017.
*/

<template>


        <SimpleHero url="/" coverColor="white" height="300px" style="padding-bottom: 0">

            <div slot="hero-content" style="text-align: center;">

                <h1 class='fg-white' style="font-size: 60px; font-weight: bold; text-transform: none; color: #12428c; text-align: center; margin-bottom: 50px; padding-left: 0.5em; padding-right: 0.5em;     margin-top: -20px;">
                    Peer-to-Peer Network
                </h1>

                <div id="map" style="height: 500px; margin-left: -35px; margin-right: -35px; margin-bottom: 0"></div>

            </div>

        </SimpleHero>


</template>


<script>

    import SimpleHero from '../styles/Simple.hero.component.vue';

    export default{

        name: 'NetworkMapHeaderCover',

        components: {
            'SimpleHero': SimpleHero,
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

                WebDollar.Applications.NetworkMap.createMap('map');
                WebDollar.Applications.NetworkMap.initialize(map);
                WebDollar.Applications.NetworkMap.initializePolylines(map);

                // DEMO
                // WebDollar.Applications.NetworkMap.createTestConnections(map);
            }

        }

    }
</script>