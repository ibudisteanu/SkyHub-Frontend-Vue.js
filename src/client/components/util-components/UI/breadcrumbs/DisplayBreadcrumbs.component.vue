/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/20/2017.
 * (C) BIT TECHNOLOGIES
 */

/*
    SCHEMA MARKUP TUTORIAL for BREADCRUMBS: https://search.google.com/structured-data/testing-tool
*/

<template>

  <ol class="breadcrumb" itemscope itemtype="http://schema.org/BreadcrumbList">

    <li v-if="this.homeAvailable" key="breadcrumb_home" itemprop="itemListElement"   itemscope itemtype="http://schema.org/ListItem">
      <router-link to="/#top" itemscope itemtype="http://schema.org/Thing" itemprop="item" >
          <i class="fa fa-home"></i>
          <span itemprop="name">Home</span>
      </router-link>
      <meta itemprop="position" content="1" />
    </li>

    <li   v-for="(breadcrumb, index) in breadcrumbs"
          :key="'breadcrumb_'+breadcrumb.name+'_'+index"

          itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem"
    >
      <router-link :key="'breadcrumb_'+breadcrumb.name+'_'+index" :to="'/'+breadcrumb.url+'#top'"   itemscope itemtype="http://schema.org/Thing" itemprop="item">
          <span itemprop="name">
              {{typeof breadcrumb.name === 'string' && breadcrumb.name.length > 30 ? breadcrumb.name.substr(0,30)+'...' :  breadcrumb.name}}
          </span>
      </router-link>
      <meta itemprop="position" :content="index+1 + (this.homeAvailable ? 1 : 0)" />
    </li>

    <li  class="active" key="breadcrumb_current_Page"         itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
      <router-link key="breadcrumb_current_Page" :to="'/'+currentPageUrl+'#top'"    itemscope itemtype="http://schema.org/Thing" itemprop="item">

        <i v-if="this.getPageTitle === 'Home'" class="fa fa-home"> </i>

        <span itemprop="name">
            {{typeof this.getPageTitle === 'string' && this.getPageTitle.length > 30 ? getPageTitle.substr(0,30)+'...' :  this.getPageTitle}}
        </span>

      </router-link>
      <meta itemprop="position" :content="breadcrumbs.length+(this.homeAvailable ? +1 : 0)">
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
          },

          homeAvailable(){
              return (this.currentPageUrl !== '/' && this.currentPageUrl !== '');
          }

      },

      methods: {
      }

  }
</script>
