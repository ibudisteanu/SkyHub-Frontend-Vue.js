<template>

    <div>

        <h2>SET YOUR POOL FEE</h2>
        <slider ref="refMiningSlider" @sliderChanged="this.changeCommission"/>

        <h2>POOL NAME</h2>
        <input type="text" class="input" v-model="poolName" value="POOL NAME"><br>

        <h2>POOL URL</h2>
        <input type="text" class="input" v-model="poolURL" placeholder="http://url"><br>


    </div>

</template>

<script>

    import slider from 'client/components/UI/elements/Slider.vue';

    export default{

        components: {
            "slider":slider
        },

        data: ()=>{

            return {
                poolName: '',
                poolURL: '',
            }

        },

        methods: {

            changeCommission() {

            },

        }

    }

</script>

