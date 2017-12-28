<template>

    <div id="p2p-network">
        <div id="networkSection">
            <div>

                <h1 class="alignCenter">Peer-to-Peer Network</h1> <br/>

                <Map/>

            </div>
        </div>
    </div>

</template>

<script>

    import Map from "client/components/Map/Map.vue"

    export default{

        components:{
            "Map":Map,
        },


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
//
//                WebDollar.Applications.NetworkMap.createMap('map');
//                WebDollar.Applications.NetworkMap.initialize(map);
//
//                WebDollar.Applications.NetworkMap.initializePolylines(map);
                // DEMO
                // WebDollar.Applications.NetworkMap.createTestConnections(map);
            }

        }


    }

</script>