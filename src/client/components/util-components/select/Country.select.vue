/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */

/*
  TUTORIAL BASED ON http://monterail.github.io/vue-multiselect/#sub-custom-option-template

*/

<template>

     <div style="display: table-row">
         <span class="input-group-addon"><img :class="(getSelectValue.css||'flag').toLowerCase()" style="display: inline-block; position: relative; vertical-align: middle; padding-top:11px !important;"></span>

         <multiselect @input="onChangeSelect" v-model="getSelectValue" label="label" track-by="label" :options="options" :option-height="16" :custom-label="customLabel" :show-labels="false" :close-on-select="true">

          <template slot="option" scope="props">
           <img :class="props.option.css" style="display: inline-block; position: relative; verticalAlign: middle; padding-top:11px !important;" />
           <div class="option__desc">
            <span class="option__title">{{ props.option.label }}</span>
           </div>
          </template>

         </multiselect>
     </div>

</template>

<script>
    import Multiselect from 'vue-multiselect'
    import {getFlags} from './flags/flags';

    const FLAGS_SIZE = 18;

    export default {

        components: { Multiselect },

        data () {
            return {

                value: {},   //{ value:'ar',   css:"flag am", label:"Armenia"},
                options: getFlags(),
            }
        },

        props: {
            defaultCountry : {default: ''},
            defaultCountryCode : {default: ''},
            onSelect : {default: function () {}},

        },

        computed:{
            getSelectValue(){
                if ((typeof this.value.value === "undefined")||(this.value.value === ''))
                    return {value: this.defaultCountryCode, css: 'flag '+this.defaultCountryCode, label: this.defaultCountry }
                else
                    return this.value;
            }
        },

        methods: {

            customLabel ({label, css, value}) {
                return `${label}`
            },

            onChangeSelect(value, id){

               this.value = value;

               let onSelect = this.onSelect||function(){};
               onSelect(value.label, this.value.value, this.value.css);

               return value;
            }
        }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>