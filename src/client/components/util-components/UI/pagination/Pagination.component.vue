<template>

    <nav aria-label="Pagination" :class="'col-centered ' + (this.hidden ? 'invizibil-element' : '')">

        <ul class="pagination">
            <li :class="'page-item '+ (this.pageIndex <= 1 ? 'disabled' : '')">
                <router-link class="page-link" :to="this.pageIndex <= 1 ? '' : getURL+(this.pageIndex-1)">
                    <i class="fa fa-angle-double-left"></i>
                    Previous
                </router-link>
            </li>

            <li v-if="this.pageIndex > 1" class="page-item">
                <router-link class="page-link" :to="getURL+(this.pageIndex-1)">
                    {{this.pageIndex-1}}
                </router-link>
            </li>
            <li class="page-item active">
                <router-link class="page-link" :to="getURL+(this.pageIndex)">
                    {{this.pageIndex}}
                    <span class="sr-only">(current)</span>
                </router-link>
            </li>
            <li v-if="this.hasNext" class="page-item">
                <router-link class="page-link" :to="getURL+(this.pageIndex+1)"  >
                    {{this.pageIndex+1}}
                </router-link>
            </li>

            <li :class="'page-item ' + (this.hasNext === false ? 'disabled' : '')">
                <router-link class="page-link" :to="this.hasNext === false ? '' : getURL+(this.pageIndex+1)">
                    Next
                    <i class="fa fa-angle-double-right"></i>
                </router-link>
            </li>
        </ul>

    </nav>

</template>

<script>
    export default{

        name : 'Pagination',

        props: {
            'pageIndex': {default: 1},
            'hasNext': {default: true},
            'url': {default: ''},
            'prefix': {default: ''},
            'hidden': {default: false},
        },

        computed:{
            getURL(){
                let str = this.url.replace(this.prefix,"");
                if (str !== '/')
                    str = str.replace(/\/$/, "");

                if ((str !== '') && (str !== '/'))
                    str = str + '/';

                return str + (this.prefix !== '' ? this.prefix+'/' : '');
            }
        }

    }
</script>