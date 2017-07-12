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
                <img :alt="getName" class="img-circle" :src="getProfilePic" style='max-width:145px; max-height: 145px; padding-bottom: 15px; margin-left: auto; margin-right: auto; display: block' />
            </span>

            <a data-toggle="dropdown" class="dropdown-toggle" href="#">

              <span class="clear" :style="{textAlign: 'center'}">

                <span class="block m-t-xs">
                    <strong class="font-bold">{{getName}}</strong>
                </span>

                <span class="text-muted text-xs block" :style="{align: 'center'}">
                    {{authenticatedUser.user.shortBio}}
                </span>

              </span>

            </a>


          </div>
          <div class="logo-element">
            <router-link to="/" >
                <img :alt="getName" class="img-circle" :src="getProfilePic" style='max-width:65px; max-height: 65px; padding-bottom: 15px; margin-left: auto; margin-right: auto; display: block' />
            </router-link>
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

  export default {
      name: 'Layout-Left-Sidebar-View',

      computed: {
          authenticatedUser(){
//              console.log('xxxxxxxxxxxxxxxxxxxx',this.$store.state.authenticatedUser.user);
//              console.log(User.getName(this.$store.state.authenticatedUser.user));
              return this.$store.state.authenticatedUser;
          },

          isLoggedIn(){
              return this.$store.getters.isUserLoggedIn;
          },

          getProfilePic(){
              return User.getProfilePic(this.authenticatedUser.user);
          },

          getName(){
              return User.getName(this.authenticatedUser.user);
          }
      },

  }
</script>


