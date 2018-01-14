/**
 * Created by BIT TECHNOLOGIES on 7/11/2017.
 */

const FRONTEND_URL = '127.0.0.1:80';
const BACKEND_URL = '127.0.0.1:4000';
const FRONTEND_WEBSITE_URL = 'http://'+trimSlash(FRONTEND_URL)+'/';
const BACKEND_WEBSITE_URL = 'http://'+trimSlash(BACKEND_URL)+'/';

function trimSlash(site) {
    return site.replace(/\/$/, "");
}

module.exports =
    {
        FRONTEND_URL : FRONTEND_URL,
        FRONTEND_WEBSITE_URL : FRONTEND_WEBSITE_URL,

        BACKEND_URL : BACKEND_URL,
        BACKEND_WEBSITE_URL : BACKEND_WEBSITE_URL,

        SERVICE_HTTP_API_URL : trimSlash(BACKEND_WEBSITE_URL) + '/api/',

        SERVICE_WEBSOCK_URL : BACKEND_URL,
        SERVICE_WEBSOCK_API : 'api/',

        SERVICE_FILE_UPLOAD_URL : trimSlash(BACKEND_WEBSITE_URL)+'/upload/image',
        SERVICE_FILE_UPLOAD_TOPIC_URL : trimSlash(BACKEND_WEBSITE_URL)+'/upload/topic-file'

    };

