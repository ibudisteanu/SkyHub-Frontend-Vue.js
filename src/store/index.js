/*
        I USE VUEX SAGA for ASYNC actions
 */

import Vue from 'vue'
import Vuex from 'vuex'

import HackerNewsModule from './modules/hackernews-module/Hackernews-module';

import AuthenticateModule from './modules/authenticate-module/AuthenticatedUser-module'
import SocketStatusModule from './modules/socket-status-module/SocketStatus-module'
import NotificationsModule from './modules/notifications-module/Notifications-module'
import LocalizationModule from './modules/localization-module/Localization-module'
import GlobalModule from './modules/global-module/Global-module'
import ContentModule from './modules/content-module/Content-module'

Vue.use(Vuex);

export function createStore () {
    return new Vuex.Store({
        modules: {
            hackernews: HackerNewsModule,
            authenticatedUser: AuthenticateModule,
            socketStatus: SocketStatusModule,
            notifications: NotificationsModule,
            localization: LocalizationModule,
            global: GlobalModule,

            content: ContentModule,
        }
    });
}

