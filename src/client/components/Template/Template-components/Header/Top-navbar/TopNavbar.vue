/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/8/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
  <div class="row border-bottom">
    <nav class="navbar navbar-static-top white-bg" role="navigation" :style="{marginBottom: 0, textAlign: 'center'}">

      <div class="navbar-header">

        <a class="navbar-minimalize minimalize-styl-2 btn btn-primary" v-if="isLoggedIn" href="#">
          <i class="fa fa-bars"></i>
        </a>

        <form role="search" class="navbar-form-custom" >
          <div class="form-group">

            <input type="text" placeholder="Search for something..." class="form-control" name="top-search" id="top-search" style="margin-left: 10px" />
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
              return User.isLoggedIn(this.$store.state.authenticatedUser.user);
          }
      }

  }
</script>
