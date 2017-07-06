/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/5/2017.
 * (C) BIT TECHNOLOGIES
 */


export default{

    SET_CURRENT_ROUTER_OBJECT_ICON: (state, { icon }) => {

        console.log('NEW ICON', state, icon);

        if ((state.notFound)||(state.object === null)) return false; //there is no object

        switch (state.type){
            case 'forum':
                state.object.iconPic = icon;
                break;
            case 'user':
                state.object.profilePic = icon;
                break;

            case 'topic': // not done yet...
            case 'reply':
                break;
        }

    },

    SET_CURRENT_ROUTER_OBJECT_COVER: (state, { cover }) => {

        console.log('NEW COVER', state, cover);

        if ((state.notFound)||(state.object === null)) return false; //there is no object

        switch (state.type){
            case 'forum':
            case 'user':
                state.object.coverPic = cover;
                break;

            case 'topic': // not done yet...
            case 'reply':
                break;
        }

    }



}