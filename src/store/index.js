import Vue from 'vue'
import Vuex from 'vuex'

import HackerNewsModule from './hackernews-store/hackernews-module';
import AuthenticateModule from './authenticate-store/authenticate-module'

Vue.use(Vuex)

export function createStore () {
    return new Vuex.Store({
        modules: {
            Hackernews: HackerNewsModule,
            Authenticate: AuthenticateModule,
        }
    });
}
