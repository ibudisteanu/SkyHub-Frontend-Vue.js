<template>

    <div>
        <div class="col-lg-12" style="padding-top: 40px">
            <div class="ibox ">

                <div class="ibox-title">
                    <h5>Admin</h5>
                </div>

                <div class="ibox-content">

                    <div style="text-align: center; padding-bottom: 40px">
                        <strong>Admin Dashboard</strong>
                        <p>
                            Administrate SkyHub
                        </p>
                    </div>

                    <div class="row" style="padding-bottom: 40px">
                        <div class="col-sm-3" align="center">
                            <h5>Resort all objects (apply sorting algorithms)</h5>
                            <LoadingButton class="btn-success" @onClick="this.handleSort" text="Resort" icon="fa fa-plus"    />

                        </div>
                        <div class="col-sm-3">
                            <h4>expand-right</h4>
                            <LoadingButton class="btn-warning" @onClick="this.handleReplaceUploadedFileSubstrings" text="Replace Uploaded Files Substring" icon="fa fa-plus"   />

                        </div>
                        <div class="col-sm-3">
                            <h4>expand-up</h4>
                            <LoadingButton class="btn-info" @onClick="this.handleBuildAllPagesList" text="Build All Pages Lists" icon="fa fa-plus"  />

                        </div>
                        <div class="col-sm-3">

                            <label >Copy DB Source</label>
                            <input v-model="copyDBSource" type="number" placeholder="ms" class="form-control" value="15">
                            <label >Copy DB Destination</label>
                            <input v-model="copyDBDestination" type="number" placeholder="ms" class="form-control" value="1">

                            <LoadingButton class="btn-danger" @onClick="this.handleCopyDB" text="Copy DB" icon="fa fa-plus"  />

                        </div>
                    </div>

                    <pre>
                        <div v-html="this.dataAnswer" />
                    </pre>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import LoadingButton from 'client/components/util-components/UI/buttons/LoadingButton.vue';
    import FetchService from 'services/communication/FetchService';

    export default{
        name: 'AdminDashboard',

        components:{
            "LoadingButton": LoadingButton,
        },

        data(){
            return {
                dataAnswer: '',
                copyDBSource: 15,
                copyDBDestination: 1,
            }
        },

        props:{
        },

        computed:{

        },

        methods:{

            async sendRequestAndWaitAnswer(button, request, data, ){

                let answer = null;
                try {
                    answer = await FetchService.sendRequestGetData( request, data);
                } catch (Exception){
                    this.dataAnswer = "Exception raised... "+Exception.toString();
                }

                this.dataAnswer = answer.toString();

                button.enableButton();
            },

            async handleSort(e, button){
                return await this.sendRequestAndWaitAnswer(button, 'admin/sort', {})
            },

            async handleReplaceUploadedFileSubstrings(e, button){
                return await this.sendRequestAndWaitAnswer(button, 'admin/build-notifications-subscribers-lists', {})
            },

            async handleBuildAllPagesList(e, button){
                return await this.sendRequestAndWaitAnswer(button, 'admin/build-all-pages-lists', {})
            },

            async handleCopyDB(e, button){
                return await this.sendRequestAndWaitAnswer(button, 'admin/copy-DB/'+this.copyDBSource+'/'+this.copyDBDestination, {})
            },


        },
    }

</script>