<template>

    <div id="map"> </div>

</template>

<script>

    export default{


        mounted(){

            if (this.$isServer) return false;

            window.onresize = function () {
                document.getElementById("map").style.height= "500px";
            };

            window.dispatchEvent(new Event('resize'));

            this.googleMapsInitialize();

        },

        methods: {

            googleMapsInitialize() {

                WebDollar.Applications.NetworkGoogleMaps.createMap('map');
                WebDollar.Applications.NetworkGoogleMaps.initialize();

                WebDollar.Applications.NetworkGoogleMaps.initializePolylines();

                //DEMO
                //WebDollar.Applications.NetworkMap.createTestConnections(map);
            }

        }

    }

</script>