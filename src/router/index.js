import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// route-level code splitting
const createListView = id => () => import('../views/CreateListView').then(m => m.default(id))
const ItemView = () => import('../views/ItemView.vue')
const UserView = () => import('../views/UserView.vue')

const LayoutElement = id => () => import('../client/components/Template/Layout/LayoutElement').then(m => m.default(id))
const Layout = () => import('client/components/Template/Layout/Layout.vue')

const LoginPage = () => import('client/pages/Site/Login.page.vue');
const AboutPage = () => import('client/pages/Site/About.page.vue');

export function createRouter () {
  return new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/hn/top/:page(\\d+)?', component: createListView('top') },
      { path: '/hn/new/:page(\\d+)?', component: createListView('new') },
      { path: '/hn/show/:page(\\d+)?', component: createListView('show') },
      { path: '/hn/ask/:page(\\d+)?', component: createListView('ask') },
      { path: '/hn/job/:page(\\d+)?', component: createListView('job') },
      { path: '/hn/item/:id(\\d+)', component: ItemView },
      { path: '/hn/user/:id', component: UserView },
      { path: '/hn/', redirect: '/hn/top' },

      { path: '/about', component: AboutPage },
      { path: '/login', component: LoginPage },
      { path: '/register', component: Layout },
      { path: '/', component: Layout },
      //{ path: '/', component: LayoutElement('test') }
    ]
  })
}
