import Vue from 'vue'
import Vuex from 'vuex'

import HackerNewsModule from './hackernews-store/Hackernews-module';
import AuthenticateModule from './authenticate-store/Authenticate-module'

Vue.use(Vuex)

export function createStore () {
    return new Vuex.Store({
        modules: {
            Hackernews: HackerNewsModule,
            Authenticate: AuthenticateModule,
        }
    });
}
