import Vue from 'vue'
//import VuexSaga from 'vuex-saga';
import App from './App.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'


//USED for SEO SSR and Client
import TitleMixin from './modules/utils/SEO/TitleMixin';
import DescriptionMixin from './modules/utils/SEO/DescriptionMixin';
import KeywordsMixin from './modules/utils/SEO/KeywordsMixin';
import ImagesMixin from './modules/utils/SEO/ImagesMixin';
import SchemaMarkupMixin from './modules/utils/SEO/SchemaMarkupMixin';
import BreadcrumbsSchemaMarkupMixin from './modules/utils/SEO/BreadcrumbsSchemaMarkupMixin';
import WebPageTypeMixin from './modules/utils/SEO/WebPageTypeMixin';


import * as filters from './modules/hackernews/util/filters'
import * as UtilitiesFunctions from './modules/utils/global-utilities/UtilitiesFunctions';

// mixin for handling title, description, etc...
// DOCUMENTATION, it is based on Vue.js Hackernews v2 https://github.com/vuejs/vue-hackernews-2.0/blob/master/src/util/title.js
Vue.mixin(TitleMixin);
Vue.mixin(DescriptionMixin);
Vue.mixin(KeywordsMixin);
Vue.mixin(ImagesMixin);
Vue.mixin(SchemaMarkupMixin);
Vue.mixin(BreadcrumbsSchemaMarkupMixin);
Vue.mixin(WebPageTypeMixin);

// register global utility helpers.
Object.keys(UtilitiesFunctions).forEach(key => {
  Vue.filter(key, UtilitiesFunctions[key])
});

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp () {
  // create store and router instances
  const store = createStore()
  const router = createRouter()

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router)

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, router, store }
}
