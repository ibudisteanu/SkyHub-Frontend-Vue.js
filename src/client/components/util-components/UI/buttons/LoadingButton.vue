/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/18/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
  <button :class="'btn '+(className||' btn-success ')+(disabled ? ' disabled ' : '')" type='button' @click="handleClick">

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
          canDisable: {default: false},
          className: {default: function (){}},
          icon: {default: ''},
          text: {default: ''},

            onClick: {default: function (){}},
      },

      methods: {
          handleClick(e){

              this.loading = true;

              if ((typeof this.canDisable === "undefined")||(this.canDisable === true))
                  this.disabled=true;

              let onClick = this.click || function (){};
              onClick(e);
          },

          enableButton(e){
              this.loading = false;
              this.disabled = false;
          }
      }
  }
</script>
