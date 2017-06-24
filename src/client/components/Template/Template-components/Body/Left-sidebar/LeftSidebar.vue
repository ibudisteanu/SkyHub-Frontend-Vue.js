<template>
  <nav class="navbar-default navbar-static-side" role="navigation" :style="{backgroundColor: '#2f4050'}">
    <div class="sidebar-collapse">
      {{authenticatedUser}}
    </div>
  </nav>
</template>

<script>

  import User from 'models/User/User.model';

  export default {
      name: 'Layout-Left-Sidebar-View',

      computed: {
          authenticatedUser(){
              console.log('xxxxxxxxxxxxxxxxxxxx',this.$store.state.authenticatedUser.user);
              console.log(User.getName(this.$store.state.authenticatedUser.user));
              return this.$store.state.authenticatedUser;
          }
      },

  }
</script>


