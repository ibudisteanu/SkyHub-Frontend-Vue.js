/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>

    <div>
        <HeaderCover  v-if=" (getTopic !== null) && (getTopicRouter.notFound === false)"
                      :title="getTopic.title||''"
                      :subTitle="getTopic.description||''"
                      :icon="getTopic.iconPic||''"
                      :cover="getTopic.coverPic||''"
                      :coverColor="getTopic.coverColor||''"
                      :breadcrumbs="getTopic.breadcrumbs||[]"
                      :url="getTopic.URL"
        />

        <WebsiteHeaderCover v-else />


        <div  class='anchor col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12 col-xs-offset-0 col-tn-12 col-tn-offset-0'  style="padding-bottom: 30px" >


            <div style='position: relative; z-index: 2 '>

                <div v-if="(getTopicRouter.notFound === false)">

                    <!--
                    <a href="http://skyhub.me/profile/muflonel2000">
                        <img class="avatar-topic-question-image" src="http://skyhub.me/uploads/images/avatars/57ddb59508e581fc1200006e/muflonel-1474148373-19926_50.jpg" alt="George Muflonel">
                    </a>

                    <img class="avatar-topic-question-circle" src="http://skyhub.me/theme/assets/images/user/offline.png" alt="offline" />
                    -->

                    <!--
                    <div id="Vote58f7e46bc24edd8c07016631" class="upvote voting-topic-question">
                        <a class="upvote upvote-on upvote-enabled" title="This is good stuff. Vote it up! (Click again to undo)"></a>
                        <span class="count" title="Total number of votes">0</span>
                        <a class="downvote  upvote-enabled" title="This is not useful. Vote it down. (Click again to undo)"></a>
                        <a class="star  upvote-enabled" title="Mark as favorite. (Click again to undo)"></a>
                    </div>
                    -->


                    <div class="topic-question" >

                        <ShowDate className="date information" :date="getTopic.dtCreation" />
                        <!--
                        <span class="views information" data-toggle="tooltip" data-placement="left" title="" data-original-title="Views 468"><i class="fa fa-eye"></i> 468</span>
                        <span class="unique-views information" data-toggle="tooltip" data-placement="left" title="" data-original-title="Unique Views 216"><i class="fa fa-eye-slash"></i> 216</span>
                        -->

                        <!-- HEADER -->

                        <div class="row form-head-line">

                            <Voting :parentId = "getTopic.id" />

                            <div >
                                <img src="https://blogcdn1.secureserver.net/wp-content/uploads/2014/06/create-a-gravatar-beard.png" class="img-circle" align="left" alt="image" style='max-width: 48px; max-height: 48px' />
                                <h3 class="reply-header-title">{{getTopic.title || '' }} </h3>

                                <h4 class="reply-header-authorName">{{ getTopic.authorId }} </h4>
                                <h5 class="reply-header-bio">{{ 'BIO' }} </h5>
                            </div>
                        </div>

                        <!-- CONTENT -->

                        <div :id="getTopic.id" class="articleContent anchor">
                            <div class="container-fluid topic-question-body">


                                <a v-if="getImage !==''" :href="getImage">
                                    <img :src="getImage" :alt="getTitle" class="topic-question-image" />
                                </a>

                                <p>
                                    <div v-html="getTopic.description" />
                                </p>

                            </div>
                        </div>

                        <!-- FOOTER -->

                        <div class="topic-question-footer">

                            <div v-if="(Array.isArray(getTopic.attachments))&&(getTopic.attachments.length > 0)">
                                <DisplayAttachments :attachments="getTopic.attachments||[]" />
                            </div>


                            <div class="topic-question-footer-buttons">
                                <ContentButtonsInline  buttonsRowStyle="paddingBottom: 10px" :parentId="this.getTopic.id" :parentName="this.getTopic.title" parentReplyId="" parentReplyName=""/>
                            </div>

                            <!--
                            <div class="col-xs-12 col-sm-7 topic-question-footer-later-edit" style={{textAlign: "right"}}>
                                <ShowDate date={this.props.topic.object.dtCreation} />
                                by <i class="glyphicon glyphicon-user"></i> <span> <a href="http://skyhub.me/profile\admin">Alexandru Ionut Budisteanu</a> </span>
                            </div>
                            -->
                        </div>

                    </div>

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

            <DisplayTopicContent parentId=""/>

            <ViewAllReplies

                    :parentId = "this.getTopic.id"
                    parentReplyId = ""
                    :key = "'ViewReplies_'+this.getTopic.id+'_'"

            >
            </ViewAllReplies>

        </div>

    </div>
</template>


<script>

    import HeaderCover from 'client/components/Template/Template-components/Header/Cover/HeaderCover.component.vue';
    import ShowDate from 'client/components/util-components/UI/show-date/ShowDate.component.vue';
    import DisplayTopicContent from 'modules/forums/topics/view-topic/DisplayTopicContent.vue';

    import ContentButtonsInline from 'modules/forums/components/ContentButtonsInline.component.vue';
    import DisplayAttachments from 'modules/attachments/view-attachments/DisplayAttachments.vue';

    import ViewAllReplies from  'modules/forums/replies/view-reply/ViewAllReplies.vue'
    import Voting from  'modules/forums/voting/Voting.component.vue'

    import Topic from 'models/Topic/Topic.model';

    export default{

        name: 'ViewTopic',

        components:{
            'HeaderCover' : HeaderCover,
            'DisplayTopicContent' : DisplayTopicContent,
            'ShowDate' : ShowDate,
            'ContentButtonsInline':ContentButtonsInline,
            'DisplayAttachments': DisplayAttachments,
            'ViewAllReplies': ViewAllReplies,
            'Voting' : Voting,
        },

        computed:{

            getTopicRouter(){
                return this.$store.state.content.contentRouter.routerObject;
            },
            
            getTopic(){
                return this.getTopicRouter.object;
            },

            getTitle(){
                return Topic.getTitle(this.getTopic)||'no title';
            },

            getImage(){
                return Topic.getImage(this.getTopic)||'';
            },

            getDescription(){
                return this.getTopic.description||'';
            },

        }

    }
</script>