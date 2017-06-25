/*
        I USE VUEX SAGA for ASYNC actions
 */

import Vue from 'vue'
import Vuex from 'vuex'

import HackerNewsModule from './modules/hackernews-module/Hackernews-module';
import AuthenticateModule from './modules/authenticate-module/AuthenticatedUser-module'
import SocketStatusModule from './modules/socket-status-module/SocketStatus-module'
import SystemNotificationsModule from './modules/system-notifications-module/SystemNotifications-module'
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
            systemNotifications: SystemNotificationsModule,
            localization: LocalizationModule,
            global: GlobalModule,

            content: ContentModule,
        }
    });
}

