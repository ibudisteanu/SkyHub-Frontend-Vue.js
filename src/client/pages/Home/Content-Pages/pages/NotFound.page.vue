<template>

    <div>
        <HeaderCover
                title="SkyHub Social Network"
                subTitle="Change the world together"
        />

        <div class="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2" style="padding-top: 30px" >
            <div class="alert alert-danger alert-dismissable">
                <p>
                    The page you have requested <strong> {{url}} </strong> <u>was not found</u> on <a href="http://skyhub.me/" >SkyHub Forum 2.0 Social Network</a>
                    <div v-html="this.error" />
                </p>
            </div>
        </div>
    </div>
</template>

<script>

    import HeaderCover from 'client/components/Template/Template-components/Header/Cover/HeaderCover.component.vue';

    export default{
        name: 'NotFound',

        components:{
            'HeaderCover': HeaderCover,
        },

        props:{
            'error': {default: ''}
        },

        computed:{
            url(){
                return this.$store.state.route.fullPath||"/";
            }
        }
    }

</script>