/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>
    <div>

        <HeaderCover  v-if=" (routerObject.object !== null) && (routerObject.notFound === false)"
                      :title="routerObject.object.title||''"
                      :subTitle="routerObject.object.description||''"
                      :icon="routerObject.object.iconPic||''"
                      :cover="routerObject.object.coverPic||''"
                      :coverColor="routerObject.object.coverColor||''"
                      :breadcrumbs="routerObject.object.breadcrumbs||[]"
                      :url="routerObject.object.URL"

                      :enableChangeIcon = "routerObject.object.isOwner"
                      :enableChangeCover = "routerObject.object.isOwner"

                      :buttons="[{class:'btn-danger', style:'width: 100%;', text:'delete',icon:'fa fa-times', onClick:handleDeleteForumButtonClick}]"

                      @onIconChanged = "iconChanged"
                      @onCoverChanged = "coverChanged"

           />

        <WebsiteHeaderCover v-else />

        <div style='position: relative; z-index: 2 '>

              <div v-if="(routerObject.notFound === false)">

              </div>
              <div v-else> <!-- ERROR -->
                <div class="row">
                  <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
                   <div class="alert alert-danger ">
                    <h4 style='textAlign: center;'>Forum <strong>NOT Found</strong></h4>
                    <strong>{{this.$store.state.route.fullPath||"/"}}</strong> was not found. Probably what you've been looking for doesn't exists or has been deleted in the mean while.
                   </div>
                  </div>
                </div>
              </div>

        </div>

      <DisplayForumContent/>

    </div>
</template>



<script>

    import HeaderCover from 'client/components/Template/Template-components/Header/Cover/HeaderCover.component.vue';
    import DisplayForumContent from 'modules/forums/forums/view-forum/DisplayForumContent.vue';

    export default{

		name: 'ViewForum',

        components:{
		    'HeaderCover' : HeaderCover,
            'DisplayForumContent' : DisplayForumContent,
        },

		computed:{

            routerObject(){
				return this.$store.state.content.contentRouter.currentObject;
			},

			routerObjectParent(){
                return this.$store.state.content.contentRouter.parentObject;
            },

		},

		methods:{
            iconChanged(imageURL){
                this.$store.dispatch('CONTENT_CURRENT_ROUTER_OBJECT_CHANGE_ICON', {icon: imageURL} );
            },

            coverChanged(imageURL){
                this.$store.dispatch('CONTENT_CURRENT_ROUTER_OBJECT_CHANGE_COVER', {cover: imageURL} );
            },

            handleDeleteForumButtonClick(){

                if (this.$store.state.global.refModal !== null) {
                    this.$store.state.global.refModal.showAlert("Are you sure you want to delete the forum?",'','Do you want to delete the forum?  <br/> <br/> <strong>'+(this.routerObject.object.title||'')+'</strong>',
                        [
                            {className: 'btn-primary', closable: true, text: 'Cancel'},
                            {className: 'btn-danger', closable: false, text: 'Yes', onClick: this.handleDeleteForum}
                        ]);
                }

            },

            async handleDeleteForum(){
                let answer = await this.$store.dispatch('CONTENT_DELETE_OBJECT', { objectId: this.routerObject.object.id } );

                if (answer.result === true){

                    this.$store.state.global.refModal.closeModal();

                    if (this.routerObjectParent.object !== null)
                        this.$router.push(this.routerObjectParent.object.URL);  // redirecting to the parent URL ;)
                    else
                        this.$router.push('/');
                } else {
                    this.$store.state.global.refModal.setError(answer.message);
                }

            },
        }

	}
</script>