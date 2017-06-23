<template>
  <div >
    <AuthenticatedHeaderNavigationMenu v-if="userLoggedIn"/>
    <NotAuthenticatedHeaderNavigationMenu v-else/>
  </div>
</template>

<script>

  import User from 'models/User/User.model';

  export default{
      name: "Header-Navigation-Menu",

      computed:{
          authenticatedUser(){
              return this.$store.state.authenticatedUser;
          },

          userLoggedIn(){
              return User.isLoggedIn(this.authenticatedUser.user);
          }
      }
  }
</script>
