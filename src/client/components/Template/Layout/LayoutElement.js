/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */

import Layout from './Layout.vue'

const camelize = str => str.charAt(0).toUpperCase() + str.slice(1)

// This is a factory function for dynamically creating root-level list views,
// since they share most of the logic except for the type of items to display.
// They are essentially higher order components wrapping ItemList.vue.
export default function LayoutElement (type) {
    return {
        name: `${type}-stories-view`,

        asyncData ({ store }) {
            // console.log('LAYOUT ELEMENT -------------------------------------- ');
            // store.dispatch('AUTHENTICATE_LOGOUT_USER',{});
            return store.dispatch('FETCH_LIST_DATA', { type:'top' })
        },

        title: camelize(type),

        render (h) {
            return h(Layout, { props: { type }})
        }
    }
}
