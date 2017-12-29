<template>

    <div id="p2p-network">
        <div id="networkSection">
            <div>

                <h1 class="alignCenter">Peer-to-Peer Network</h1> <br/>

                <NativeMap/>

            </div>
        </div>
    </div>

</template>

<script>

    import NativeMap from "client/components/Map/NativeMap.vue"

    export default{

        components:{
            "NativeMap":NativeMap,
        },

    }

</script>