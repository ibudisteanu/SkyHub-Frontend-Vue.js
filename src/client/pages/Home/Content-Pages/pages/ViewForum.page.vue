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
					 :breadcrumbs="routerObject.object.arrBreadcrumbs||[]"
					 :url="routerObject.object.URL"
	   />

	   <WebsiteHeaderCover v-else />


	   <div style='position: relative; z-index: 2 '>

		  <div v-if="(routerObject.notFound === false)">
			 <h1>
				 <span>{{routerObject.object.title||'NO TITLE'}}</span>
			 </h1>
		  </div>
		  <div v-else> <!-- ERROR -->
            <div class="row">
              <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
               <div class="alert alert-danger ">
                <h4 style='textAlign: center;'>Forum <strong>NOT Found</strong></h4>
                <strong>{{this.$router.fullPath||"/"}}</strong> was not found. Probably what you've been looking for doesn't exists or has been deleted in the mean while.
               </div>
              </div>
            </div>
		  </div>

	   </div>

	  <DisplayForumContent/>

 </div>
</template>



<script>
	export default{

		name: 'ViewForum',

		computed:{

            routerObject(){
				return this.$store.state.content.contentRouter.routerObject;
			}

		}

	}
</script>