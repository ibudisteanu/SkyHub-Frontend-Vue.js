/**
* Created by Alexandru Ionut Budisteanu - SkyHub on 6/21/2017.
* (C) BIT TECHNOLOGIES
*/

<template>
  <div class="sticky-button-position" :style="{right: rightOffset+'px'}" @click="handleStickyButtonClick">


    <span class="badge badge-primary pull-right">0</span>

    <a class="sticky-button sticky-button-notification">

      <i class="fa fa-bell sticky-button-icon "></i>

    </a>

  </div>
</template>


<script>

  export default{

      name: 'NotificationStickyButton',

      props: ['rightOffset'],

      methods:{
          handleStickyButtonClick(e){

          }
      }
  }
</script>


