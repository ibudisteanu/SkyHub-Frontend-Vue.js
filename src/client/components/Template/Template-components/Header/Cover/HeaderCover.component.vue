/**
 * Created by BIT TECHNOLOGIES on 5/28/2017.
 */

<template>
    <div style="padding-bottom: 20px">

        <div class="header-cover row  border-bottom white-bg dashboard-header " :style="{backgroundImage: 'url('+coverPic||''+')'+')', backgroundColor: (this.props.coverColor!=='' ? '#'+this.props.coverColor : 'darkblue'), marginLeft: -25, marginRight: -25}}>

        {(this.props.showLayOver||false) == true ? <div class='header-cover-layover'> </div> : '' }

        {(this.props.showDescriptionMenu||true) == true ? this.renderDescriptionMenu() : 'NU AFISEZ NIMIC' }

    </div>

    {(typeof this.props.breadcrumbs !== "undefined") && (this.props.breadcrumbs !== [])
    ?
    <div class="row wrapper border-bottom white-bg page-heading" style={{paddingBottom: 15}}>
        <DisplayBreadcrumbs breadcrumbs={this.props.breadcrumbs} currentPageTitle={this.props.title} currentPageUrl={this.props.url} />
    </div>
    :
    ''
    }

    </div>

</template>


<script>

    import DisplayBreadcrumbs from 'client/components/util-components/UI/breadcrumbs/DisplayBreadcrumbs.component.vue';

    export default{

        name: 'HeadCover',



    }
</script>




import React from 'react';

import DisplayBreadcrumbs from '../../../../util-components/UI/breadcrumbs/DisplayBreadcrumbs.component.vue';

export default class HeaderCover extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            follow: 'follow me',
            followActive: false,
            likeCount: 999,
            likeActive: false,
            likeTextStyle: 'fg-white'
        };
    }
    handleFollow() {
        this.setState({
            follow: 'followed',
            followActive: true
        });
    }
    handleLike() {
        this.setState({
            likeCount: 1000,
            likeActive: true,
            likeTextStyle: 'fg-orange75'
        });
    }

    renderSocialMenu(){
        return (
            <div class="col-xs-12 col-sm-4">




                <div class='header-cover-avatar'>
                    <image src='/imgs/app/avatars/avatar.jpg' height='100' width='100' style={{display: 'block', borderRadius: 100, border: '2px solid #fff', margin: 'auto', marginTop: 50}} />
                    <h4 class='fg-white text-center'>Anna Sanchez</h4>
                    <h5 class='fg-white text-center' style={{opacity: 0.8}}>DevOps Engineer, NY</h5>
                    <hr class='border-black75' style={{borderWidth: 2}}/>
                    <div class='text-center'>
                        <button active={this.state.followActive} onClick={::this.handleFollow}>
                            <span>{this.state.follow}</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    renderDescriptionMenu(){
        return (
            <div>


                <div class="col-xs-12 " >
                    <div class={'header-cover-description'} >
                        <div>
                            <image src={this.props.icon||'/res/logo/SkyHub-logo.png'} />

                            <div class="row">
                                <h1 class='fg-white'>{this.props.title}</h1>
                                <br/>
                                {this.props.subTitle !== '' ? <h2 class='fg-white' style={{opacity: 0.8}}>{this.props.subTitle}</h2> : ''}
                            </div>

                            <div class="header-cover-toolbar" >
                                <div style={{display: 'inline-block'}}>

                                    {this.props.buttons}

                                    <button type="button" id='likeCount' onClick={::this.handleLike}>
                                        <i class='icon-fontello-heart-1' />
                                    </button>

                                    <label class='header-cover-toolbar-label' >
                                      <span class={this.state.likeTextStyle}>{this.state.likeCount} likes</span>
                                    </label>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                { 1== 2 ? ::this.renderSocialMenu : ''}

            </div>

        );
    }

    render() {

        return (


        )
    }
}
