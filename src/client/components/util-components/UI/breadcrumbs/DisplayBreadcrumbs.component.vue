/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/20/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

  <ol class="breadcrumb" >

    <li v-if="currentPageUrl !== '/' && currentPageUrl !== ''" key="breadcrumb_home">
      <router-link to="/#top" >
          <i class="fa fa-home">
            Home
          </i>
      </router-link>
    </li>

    <li   v-for="(breadcrumb, index) in breadcrumbs"
          :key="'breadcrumb_'+breadcrumb.name+'_'+index"
    >
      <router-link :key="'breadcrumb_'+breadcrumb.name+'_'+index" :to="'/'+breadcrumb.url+'#top'" >
        {{typeof breadcrumb.name === 'string' && breadcrumb.name.length > 30 ? breadcrumb.name.substr(0,30)+'...' :  breadcrumb.name}}
      </router-link>

    </li>

    <li  class="active" key="breadcrumb_current_Page">
      <router-link key="breadcrumb_current_Page" :to="'/'+currentPageUrl+'#top'" >

        <i v-if="this.getPageTitle === 'Home'" class="fa fa-home"> </i>

        {{typeof this.getPageTitle === 'string' && this.getPageTitle.length > 30 ? getPageTitle.substr(0,30)+'...' :  this.getPageTitle}}

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
          'currentPageTitle': {default: ''},
      },

      computed:{
          getPageTitle(){
              if ((this.currentPageUrl === '')||(this.currentPageUrl === '/')) return 'Home';

              return this.currentPageTitle;
          }
      },

      methods: {

      }

  }
</script>
