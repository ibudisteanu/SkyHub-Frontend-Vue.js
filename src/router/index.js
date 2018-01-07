import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// route-level code splitting

const HomePage = () => import('client/pages/Home.page.vue');
const transactionsPage = () => import('client/pages/transactions.page.vue');

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

            // { path: '/about', component: AboutPage },
            // { path: '/contact', component: AboutPage },
            // { path: '/login', component: LoginPage },
            // { path: '/signin', component: LoginPage },
            //
            // { path: '/register', component: RegistrationPage },
            // { path: '/signup', component: RegistrationPage },
            // { path: '/registration', component: RegistrationPage },

            // { path: '/:url*', component: HomePage },

            { path: '/transactions', component: transactionsPage },
            { path: '/:a?/:b?/:c?/:d?', component: HomePage },
            { path: '/:a?/:b?/:c?', component: HomePage },
            { path: '/:a?/:b?', component: HomePage },
            { path: '/:a?', component: HomePage },
            { path: '/', component: HomePage },

        ]
    })
}
