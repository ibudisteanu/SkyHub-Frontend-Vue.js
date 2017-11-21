/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/18/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
  <button type="submit" :class="'btn '+(className||' btn-success ')+(disabled ? ' disabled ' : '')" @click="handleClick">

    <i :class="loading ? 'fa fa-spinner fa-spin' : icon||'fa fa-plus'" style='margin-right:10px' />

    {{text||'Button'}}

  </button>
</template>

<script>
  export default{

      name: 'LoadingButton',

      data : function (){
          return {
              loading:false,
              disabled:false,
          }
      },

      props: {
          canDisable: {default: true},
          className: {default: function (){}},
          icon: {default: ''},
          text: {default: ''},
      },

      //@onClick

      methods: {
          handleClick(e){

              this.loading = true;

              if (this.canDisable  === true){
                  return false;
              }

              if ((typeof this.canDisable === "undefined")||(this.canDisable === true))
                  this.disabled=true;

              this.$emit('onClick',e, this);


          },

          enableButton(e){
              this.loading = false;
              this.disabled = false;
          }
      }
  }
</script>
