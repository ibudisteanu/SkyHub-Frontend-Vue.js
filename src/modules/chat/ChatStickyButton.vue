/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/9/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
  <div class="sticky-button-position" :style="{right: rightOffset+'px'}" @click="handleOpenChatClick">

    <span class="badge badge-warning pull-right">0</span>

    <a class="sticky-button sticky-button-chat">

      <i class="fa fa-comments sticky-button-icon"></i>

    </a>

  </div>
</template>

<script>
  export default{
      name: "ChatStickButton",

      props: ['rightOffset'],
      
      methods:{
          handleOpenChatClick(e){
              // Open close small chat
              $('.open-small-chat').on('click', function () {
                  $(this).children().toggleClass('fa-comments').toggleClass('fa-remove');
                  $('.small-chat-box').toggleClass('active');
              });

              // Initialize slimscroll for small chat
              $('.small-chat-box .content').slimScroll({
                  height: '234px',
                  railOpacity: 0.4
              });

          }
      }
  }
</script>