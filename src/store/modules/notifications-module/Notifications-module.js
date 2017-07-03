/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/3/2017.
 * (C) BIT TECHNOLOGIES
 */


import SystemNotificationsModule from './system-notifications-module/SystemNotifications-module';
import UserNotificationsModule from './user-notifications-module/UserNotifications-module';

export default {
    modules: {
        system: SystemNotificationsModule,
        user: UserNotificationsModule,
    }
}