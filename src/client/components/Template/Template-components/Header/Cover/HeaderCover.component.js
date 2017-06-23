/**
 * Created by BIT TECHNOLOGIES on 5/28/2017.
 */

import React from 'react';

import DisplayBreadcrumbs from './../../../../util-components/UI/breadcrumbs/DisplayBreadcrumbs.component';

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
            <div className="col-xs-12 col-sm-4">




                <div className='header-cover-avatar'>
                    <image src='/imgs/app/avatars/avatar.jpg' height='100' width='100' style={{display: 'block', borderRadius: 100, border: '2px solid #fff', margin: 'auto', marginTop: 50}} />
                    <h4 className='fg-white text-center'>Anna Sanchez</h4>
                    <h5 className='fg-white text-center' style={{opacity: 0.8}}>DevOps Engineer, NY</h5>
                    <hr className='border-black75' style={{borderWidth: 2}}/>
                    <div className='text-center'>
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


                <div className="col-xs-12 " >
                    <div className={'header-cover-description'} >
                        <div>
                            <image src={this.props.icon||'/res/logo/SkyHub-logo.png'} />

                            <div className="row">
                                <h1 className='fg-white'>{this.props.title}</h1>
                                <br/>
                                {this.props.subTitle !== '' ? <h2 className='fg-white' style={{opacity: 0.8}}>{this.props.subTitle}</h2> : ''}
                            </div>

                            <div className="header-cover-toolbar" >
                                <div style={{display: 'inline-block'}}>

                                    {this.props.buttons}

                                    <button type="button" id='likeCount' onClick={::this.handleLike}>
                                        <i className='icon-fontello-heart-1' />
                                    </button>

                                    <label className='header-cover-toolbar-label' >
                                      <span className={this.state.likeTextStyle}>{this.state.likeCount} likes</span>
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
          <div style={{paddingBottom: 20}}>

              <div className="header-cover row  border-bottom white-bg dashboard-header " style={{backgroundImage: 'url('+(this.props.coverPic||'')+')', backgroundColor: (this.props.coverColor!=='' ? '#'+this.props.coverColor : 'darkblue'), marginLeft: -25, marginRight: -25}}>

                  {(this.props.showLayOver||false) == true ? <div className='header-cover-layover'> </div> : '' }

                  {(this.props.showDescriptionMenu||true) == true ? this.renderDescriptionMenu() : 'NU AFISEZ NIMIC' }

              </div>

              {(typeof this.props.breadcrumbs !== "undefined") && (this.props.breadcrumbs !== [])
              ?
                <div className="row wrapper border-bottom white-bg page-heading" style={{paddingBottom: 15}}>
                  <DisplayBreadcrumbs breadcrumbs={this.props.breadcrumbs} currentPageTitle={this.props.title} currentPageUrl={this.props.url} />
                </div>
              :
                ''
              }

          </div>

        )
    }
}
