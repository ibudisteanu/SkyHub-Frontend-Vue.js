/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/10/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
  <ul class="nav navbar-top-links navbar-right">

    <li>
      <router-link to="/" class="item-footer-menu" >
        <i class="fa fa-home"></i>
        <span class="m-r-sm text-muted welcome-message">Home</span>
      </router-link>
    </li>



    <li>
      <router-link to="/login" :event="''" @click.native.prevent="handleSignIn" >
        <i class="fa fa-sign-in"></i>
        <span class="m-r-sm text-muted ">Log in</span>
      </router-link>
    </li>

    <li>
      <router-link to="/register"  :event="''" @click.native.prevent="handleRegister" >
        <i class="fa fa-user-plus"></i>
        <span class="m-r-sm text-muted">Register</span>
      </router-link>
    </li>


  </ul>
</template>

<script>
  export default{

      methods:{
          handleSignIn(e){
              e.preventDefault(); e.stopPropagation();
              console.log("SIGN IN");

              this.$refs['refAuthenticationModal'].openLogin();

              if ((this.props.routerState !== null)&&(this.props.routerState.refAuthenticationModal !== null))
                  this.props.routerState.refAuthenticationModal.openLogin();
          },

          handleRegister(e){
              e.preventDefault(); e.stopPropagation();

              this.$refs['refAuthenticationModal'].openRegistration();
              if ((this.props.routerState !== null)&&(this.props.routerState.refAuthenticationModal !== null))
                  this.props.routerState.refAuthenticationModal.openRegistration();
          }
      }
  }
</script>

