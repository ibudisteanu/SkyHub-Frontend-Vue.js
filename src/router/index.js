import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// route-level code splitting

const HomePage = () => import('client/pages/Home.page.vue');
const transactionsPage = () => import('client/pages/transactions.page.vue');
const networkPage = () => import('client/pages/pool.page.vue');
const faqPage = () => import('client/pages/faq.page.vue');

export function createRouter () {

    return new Router({
        mode: 'history',
        scrollBehavior(to, from, savedPosition) {
            //console.log('router scroll', to, from, to === from);

            if (savedPosition) {
                return savedPosition
            } else {
                if (to.hash) {
                    return {
                        selector: to.hash
                    }
                }
            }

        },
        routes: [

            { path: '/faq', component: faqPage },
            { path: '/mypool', component: networkPage },
            { path: '/transactions', component: transactionsPage },
            { path: '/:a?/:b?/:c?/:d?', component: HomePage },
            { path: '/:a?/:b?/:c?', component: HomePage },
            { path: '/:a?/:b?', component: HomePage },
            { path: '/:a?', component: HomePage },
            { path: '/', component: HomePage },

        ]
    })
}
