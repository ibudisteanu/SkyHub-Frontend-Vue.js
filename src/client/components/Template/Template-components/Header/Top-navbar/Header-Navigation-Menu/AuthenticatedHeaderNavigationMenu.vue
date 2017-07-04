/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/10/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
  <ul class="nav navbar-top-links navbar-right">


    <li>
      <router-link to="/" >
        <i class="fa fa-home"></i>
        <span class="m-r-sm text-muted welcome-message">Home</span>
      </router-link>
    </li>

    <li>
      <router-link to="/" >
        <i class="fa fa-user"></i>
        <span class="m-r-sm text-muted welcome-message">Profile</span>
      </router-link >
    </li>


    <NotificationsMenu/>


    <li>
      <router-link to="/logout"  :event="''" @click.native.prevent="handleLogout" >
        <i class="fa fa-sign-out"></i> Log out
      </router-link>
    </li>

    <li>
      <a class="right-sidebar-toggle">
        <i class="fa fa-tasks"></i>
      </a>
    </li>

  </ul>
</template>

<script>

  import NotificationsMenu from 'modules/notifications/NotificationsMenu.vue';

  export default {
      name: 'Header-Navigation-Menu-Authenticated',

      components: {NotificationsMenu},

      computed:{
          authenticatedUser(){
              console.log('authenticatedUser',this.$store.state)
              return this.$store.state.authenticatedUser.user.id||'none';
          },
      },

      methods:{
          handleLogout(e){
              e.preventDefault(); e.stopPropagation();

              this.$store.dispatch('AUTHENTICATE_LOGOUT_USER',{});
          }
      }

  }
</script>
