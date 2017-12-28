<template>

    <div id="p2p-network">
        <div id="networkSection" class="fullSection" >
            <div class="verticalAlignMiddle fullHeight">

                <h1 class="alignCenter">Peer-to-Peer Network</h1> <br/>

                <div id="map" style="height: 500px; margin-bottom: 0; margin-right: -16px"></div>

            </div>
        </div>
    </div>

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

                WebDollar.Applications.NetworkMap.createMap('map');
                WebDollar.Applications.NetworkMap.initialize(map);

                WebDollar.Applications.NetworkMap.initializePolylines(map);
                // DEMO
                // WebDollar.Applications.NetworkMap.createTestConnections(map);
            }

        }


    }

</script>