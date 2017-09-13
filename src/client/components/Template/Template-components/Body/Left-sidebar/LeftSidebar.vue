<template>
  <nav class="navbar-default navbar-static-side" role="navigation" :style="{backgroundColor: '#2f4050'}">
    <div class="sidebar-collapse">

        <a v-if="isLoggedIn" class="navbar-minimalize minimalize-styl-2 btn btn-primary"  href="#">
            <i class="fa fa-bars"></i>
        </a>

      <ul class="nav metismenu" id="side-menu" >
        <li class="nav-header" :style="{paddingTop: 15}">

            <div class="dropdown profile-element">

            <span v-if="isLoggedIn">
                <ImageCropUpload :enableFileUpload="enableChangeAvatar" ref="refIconImageCropUpload" @onImageChanged="avatarChanged" :width="150" :height="150" />
                <div class="image-with-caption-link" style="display: inline-block"  @click="handleAvatarImageCropUploadModal"    @mouseover="imageAvatarActive=true; " @mouseout="imageAvatarActive=false">
                     <router-link :to="''" style="margin-bottom: 0">
                        <img :alt="this.getUserName"  :class="'img-circle '+(showPicBorder ? 'profile-pic-white-border-circle' : '')"  :src="getProfilePic" style='width:135px; height: 135px; margin-left: auto; margin-right: auto; display: block' />
                        <span v-if="enableChangeAvatar" :style="showPicBorder ? 'margin-left: 5px; margin-bottom: 5px; width: 90%;' : '' + 'color:white' + 'opacity: '+(imageAvatarActive ?  1 : 0.7)" ><i class="fa fa-picture-o"/> {{imageAvatarActive ? 'Change Avatar' : ''}}</span>
                     </router-link>
                </div>
            </span>

            <div data-toggle="dropdown" class="dropdown-toggle" >

              <span class="clear" :style="{textAlign: 'center'}">

                <span class="block m-t-xs">
                    <strong class="font-bold" style="color: white">{{this.getUserName}}</strong>
                </span>

                <br/>

                <span class="text-muted text-xs block" :style="{align: 'center'}">
                    {{authenticatedUser.user.shortBio}}
                </span>

              </span>

            </div>


          </div>
          <div class="logo-element">
              <img :alt="this.getUserName" class="img-circle" :src="getProfilePic" style='max-width:65px; max-height: 65px; padding-bottom: 15px; margin-left: auto; margin-right: auto; display: block' />
          </div>
        </li>
        <li class="active">
          <router-link to="/" >
            <i class="fa fa-home"></i> <span class="nav-label">Home</span>
          </router-link>
        </li>
        <li>
          <router-link to="/" >
            <i class="fa fa-user"></i> <span class="nav-label">Profile</span>
          </router-link>
        </li>
        <li>
          <router-link to="/" >
            <i class="fa fa-dollar"></i> <span class="nav-label">Income <strong>$0.0</strong></span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>

  import User from 'models/User/User.model';
  import ImageCropUpload from 'client/components/util-components/file-upload/vue-image-crop-upload/ImageCropUpload.component.vue';

  export default {
      name: 'Layout-Left-Sidebar-View',

      components:{
          'ImageCropUpload':ImageCropUpload,
      },

      data: function () {
          return {
              imageAvatarActive: false,
          }
      },

      props:{
          avatar: {default: ''},
          enableChangeAvatar : {default: true},
          showPicBorder: {default: true},
      },

      computed: {
          authenticatedUser(){
              return this.$store.state.authenticatedUser;
          },

          isLoggedIn(){
              return this.$store.getters.isAuthenticatedUserLoggedIn;
          },

          getProfilePic(){
              return this.$store.getters.getAuthenticatedUserProfilePic;
          },

          getUserName(){
              return this.$store.getters.getAuthenticatedUserFullName;
          }
      },

      methods:{
          handleAvatarImageCropUploadModal(e){
              //e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); //stil not working...

              if ((this.imageAvatarActive)&&(typeof this.$refs['refIconImageCropUpload'] !== 'undefined'))
                  this.$refs['refIconImageCropUpload'].showModal();
          },

          async avatarChanged(imageURL, field){

              await this.$store.dispatch('CONTENT_USERS_CHANGE_PROFILE_PIC', {userId: this.$store.state.authenticatedUser.user.id||'', profilePic: imageURL} );
              this.$emit('onAvatarChanged', imageURL);
          },

      }

  }
</script>


