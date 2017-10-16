/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/8/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
  <div class="row border-bottom">
    <nav class="navbar navbar-fixed-top white-bg" role="navigation" :style="{marginBottom: 0, textAlign: 'center'}">

      <div class="navbar-header">


        <router-link to="/" >
            <img src="/public/SkyHub-logo.png" alt="SkyHub Social Network" height="44px" style="padding: 0 15px 0 5px; float:left" />
        </router-link>

        <i class="fa fa-search" style="float: left; padding-top: 20px"></i>

        <form role="search" class="navbar-form-custom"  >
          <div class="form-group">

            <input type="text" placeholder="Search for something..." class="form-control" name="top-search" id="top-search" style="margin-left: 5px" />

          </div>
        </form>
      </div>


      <HeaderNavigationMenu />

    </nav>
  </div>
</template>

<script>

  import HeaderNavigationMenu from './Header-Navigation-Menu/HeaderNavigationMenu.vue';
  import User from 'models/User/User.model';

  export default {
      name: 'Top-Navbar',
      components: {HeaderNavigationMenu},

      computed:{
          isLoggedIn(){
              return this.$store.getters.isAuthenticatedUserLoggedIn;
          }
      }

  }
</script>
