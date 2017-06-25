/*
        I USE VUEX SAGA for ASYNC actions
 */

import Vue from 'vue'
import Vuex from 'vuex'

import HackerNewsModule from './hackernews-module/Hackernews-module';
import AuthenticateModule from './authenticate-module/AuthenticatedUser-module'
import SocketStatusModule from './socket-status-module/SocketStatus-module'
import SystemNotificationsModule from './system-notifications-module/SystemNotifications-module'
import LocalizationModule from './localization-module/Localization-module'
import GlobalModule from './global-module/Global-module'
import ContentModule from './content-module/Content-module'

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

