/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */


import actions from './Content-actions'
import mutations from './Content-mutations'
import getters from './Content-getters'

import ContentRouter from './router-module/ContentRouter-module';
import ContentForums from './forums-module/ContentForums-module';
import ContentTopics from './topics-module/ContentTopics-module';
import ContentReplies from './replies-module/ContentReplies-module';
import ContentVotes from './votes-module/ContentVotes-module';

export default {
    modules: {
        contentRouter: ContentRouter,
        contentForums: ContentForums,
        contentTopics: ContentTopics,
        contentReplies: ContentReplies,
        contentVotes : ContentVotes,
    },
    state:  {

    },
    actions,
    mutations,
    getters
}

