import Vue from 'vue'
import Vuex from 'vuex'

import HackerNewsModule from './hackernews-store/Hackernews-module';
import AuthenticateModule from './authenticate-store/Authenticate-module'
import SocketStatusModule from './socket-status-store/SocketStatus-module'

Vue.use(Vuex)

export function createStore () {
    return new Vuex.Store({
        modules: {
            Hackernews: HackerNewsModule,
            Authenticate: AuthenticateModule,
            SocketStatus: SocketStatusModule,
        }
    });
}
