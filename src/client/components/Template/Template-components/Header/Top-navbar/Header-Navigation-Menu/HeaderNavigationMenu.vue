/**
* Created by Alexandru Ionut Budisteanu - SkyHub on 6/10/2017.
* (C) BIT TECHNOLOGIES
*/


<template>
  <div >
    <AuthenticatedHeaderNavigationMenu v-if="userLoggedIn"/>
    <NotAuthenticatedHeaderNavigationMenu v-else/>
  </div>
</template>

<script>

  import AuthenticatedHeaderNavigationMenu from './AuthenticatedHeaderNavigationMenu.vue';
  import NotAuthenticatedHeaderNavigationMenu from './NotAuthenticatedHeaderNavigationMenu.vue';
  import User from 'models/User/User.model';

  export default{
      name: "Header-Navigation-Menu",

      components: {AuthenticatedHeaderNavigationMenu, NotAuthenticatedHeaderNavigationMenu},

      computed:{
          authenticatedUser(){
              return this.$store.state.authenticatedUser;
          },

          userLoggedIn(){
              return this.$store.getters.isAuthenticatedUserLoggedIn;
          }
      }
  }
</script>
