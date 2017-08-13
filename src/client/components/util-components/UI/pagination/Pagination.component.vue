<template>

    <nav aria-label="Pagination" class="col-centered">

        <ul class="pagination">
            <li :class="'page-item '+ (this.pageIndex <= 1 ? 'disabled' : '')">
                <a class="page-link" href="#" tabindex="-1">
                    <i class="fa fa-angle-double-left"></i>
                    Previous
                </a>
            </li>

            <li v-if="this.pageIndex > 1" class="page-item">
                <a class="page-link" :href="getURL+(this.pageIndex-1)">{{this.pageIndex-1}}</a>
            </li>
            <li class="page-item active">
                <a class="page-link" href="#">{{this.pageIndex}}
                    <span class="sr-only">(current)</span>
                </a>
            </li>
            <li v-if="this.hasNext" class="page-item">
                <a class="page-link" :href="getURL+(this.pageIndex+1)">{{this.pageIndex+1}}</a>
            </li>

            <li :class="'page-item' + (this.hasNext === false ? 'disabled' : '')">
                <a class="page-link" :href="getURL+(this.pageIndex+1)">
                    Next
                    <i class="fa fa-angle-double-right"></i>
                </a>
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
        },

        computed:{
            getURL(){
                let str = this.url.replace(/\/$/, "");
                return (str !== '' ? str+'/' : '')+(this.prefix !== '' ? this.prefix+'/' : '');
            }
        }

    }
</script>