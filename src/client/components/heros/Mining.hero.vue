<template>

    <div id="p2p-network">
        <div id="networkSection">
            <div>

                <h1 class="alignCenter">Mine NOW in Browser!</h1> <br/>

                <Mining/>

            </div>
        </div>
    </div>


</template>

<script>

    import Mining from "client/components/Mining/Mining.vue"

    export default{

        name: "MiningHero",

        components:{
            "Mining": Mining,
        }

    }

</script>