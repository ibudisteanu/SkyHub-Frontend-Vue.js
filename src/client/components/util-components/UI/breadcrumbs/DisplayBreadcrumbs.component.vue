/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/20/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

  <ol class="breadcrumb" >

    <li v-if="currentPageUrl !== '/' && currentPageUrl !== ''" key="breadcrumb_home">
      <router-link to="/" >
        Home
      </router-link>
    </li>

    <li   v-for="(breadcrumb, index) in breadcrumbs"
          :key="'breadcrumb_'+breadcrumb.name+'_'+index"
    >
      <router-link :key="'breadcrumb_'+breadcrumb.name+'_'+index" :to="breadcrumb.url" >
        {{object.name}}
      </router-link>

    </li>

    <li  class="active" key="breadcrumb_current_Page">
      <router-link key="breadcrumb_current_Page" :to="currentPageUrl" >
        {{getPageTitle()}}
      </router-link>
    </li>


  </ol>

</template>



<script>
  export default{

      name: 'DisplayBreadcrumbs',

      props: {
          'currentPageUrl': {default: ''},
          'breadcrumbs': {function (){return []}},
      },

      methods: {
          getPageTitle(){
              if ((this.currentPageUrl === '')||(this.currentPageUrl === '/')) return 'Home';

              return currentPageTitle;
          }
      }

  }
</script>
