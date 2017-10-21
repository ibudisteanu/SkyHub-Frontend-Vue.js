/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/8/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
  <div class="row border-bottom">
    <nav class="navbar navbar-fixed-top white-bg" role="navigation" :style="{marginBottom: 0, textAlign: 'center'}">

      <div class="navbar-header">



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
