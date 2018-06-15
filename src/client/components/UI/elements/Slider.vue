<template>
    <div class="poolSlider" >
        <vueSlider class="miningSlider" ref="slider" :piecewise="false"
                    tooltip="always" v-model="value" @callback="handleValueChanged" ></vueSlider>
    </div>
</template>


<script>

    import vueSlider from './../../../../../node_modules/vue-slider-component/src/vue2-slider.vue';

    export default {
        name: 'slider',

        components: {
            "vueSlider":vueSlider,
        },

        //@changed

        data() {
            return {
                value: 0,
            }
        },

        methods: {

            handleValueChanged(value){

                this.$emit('changed', value );

            }

        },

        mounted() {
            if (typeof window === "undefined") return;
        }
    }

</script>

<style>

    .poolSlider .miningSlider{
        width: 100%!important;
    }

    .miningSlider {
        padding-top: 15px !important;
        padding-bottom: 15px !important;
        padding-left: 20px !important;
        background-color: #262626;
    }

    .vue-slider-component .vue-slider-piecewise {
        background-color: #424242 !important;
    }

    .vue-slider-component .vue-slider-process {
        /*background: #fec02c !important;*/
        background: linear-gradient(to right, #3e3623 29%, #422d2d 100%) !important;
    }

    .vue-slider-component .vue-slider-tooltip{
        min-width: 40px!important;
        color: #262626!important;
        border: 1px solid #fec02c!important;
        background-color: #fec02c!important;
        border: 1px solid #bdbdbd2e!important;
        background-color: #bdbdbd2e!important;
        color: #fec02c!important;
    }

</style>