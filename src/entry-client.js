import Vue from 'vue'
import 'es6-promise/auto'
import { createApp } from './app'

import ProgressBar from './modules/hackernews/components/ProgressBar.vue'
import WebDollarNodes from 'services/nodes-module/WebDollarNodes.js';

// global progress bar
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)

// a global mixin that calls `asyncData` when a route component's params change
Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to
      }).then(next).catch(next)
    } else {
      next()
    }
  }
});

// usage of tooltips https://stackoverflow.com/questions/37078423/how-can-add-bootstrap-tooltip-inside-vue-js
Vue.directive('tooltip', function(el, binding){
    $(el).attr('data-toggle', 'tooltip')
        .attr('data-placement', binding.arg)
        .attr('trigger', 'hover').tooltip({title: binding.value})
});

Vue.directive('popover', function(el, binding){

    $(el).attr('data-toggle', 'popover')
        .attr('data-placement', binding.arg)
        .attr('data-html', binding.value.html||false)
        .attr('trigger', 'hover').popover({title: binding.value.title, content: binding.value.content});

    $(el).data('bs.popover').options.content = binding.value.content;
    $(el).popover('show');
});

const { app, router, store } = createApp()

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

//send the store and dispatch to the FetchService (SocketClient needs store.socketStatus

store.dispatch('SYSTEM_NOTIFICATIONS_CHECK_PERMISSION',{});
store.dispatch('USER_NOTIFICATIONS_FETCHING_SERVICE_START',{});

console.log("@@@@@@@@@ STORE", store);

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.

    WebDollarNodes.test();

  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
    if (!asyncDataHooks.length) {
      return next()
    }

    bar.start()
    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
      .then(() => {
        bar.finish()
        next()
      })
      .catch(next)
  })

  // actually mount to DOM
  app.$mount('#app')
})

// service worker
if ('https:' === location.protocol && navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-worker.js')
}
