<template>
    <div class="poolSlider" >
        <vueSlider class="miningSlider" ref="slider" :disabled="this.disabled" :interval="this.interval" :min="this.min" :max="this.max" :dot-size="14" :piecewise="false" tooltip="always" v-model="value" @callback="handleValueChanged" ></vueSlider>
    </div>
</template>


<script>

    import vueSlider from './../../../../../node_modules/vue-slider-component/src/vue2-slider.vue';

    export default {
        name: 'slider',
        props:{
            max:{default:'100'},
            min:{default:'0'},
            interval:{default:'1'},
            disabled:{default:false}
        },

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

    .miningSlider {
        padding-top: 15px !important;
        padding-bottom: 15px !important;
        padding-left: 20px !important;
        background-color: #262626;
        padding-left: 14px!important;
    }

    .vue-slider-component .vue-slider-piecewise {
        background-color: #424242 !important;
    }

    .disabledSlider {
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