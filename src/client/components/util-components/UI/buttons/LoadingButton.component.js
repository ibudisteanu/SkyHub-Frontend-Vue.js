/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/18/2017.
 * (C) BIT TECHNOLOGIES
 */

import React from 'react';

export default class LoadingButton extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

      loading:false,
      disabled:false,
    }

  }

  handleClick(e){
    this.setState({
      loading: true,
    });

    if ((typeof this.props.canDisable === "undefined")||(this.props.canDisable === true))
      this.setState({
        disabled:true,
      });


    let onClick = this.props.onClick || function (){};
    onClick(e);
  }

  enableButton(e){
    this.setState({
      loading: false,
      disabled:false,
    })
  }

  render(){

    return (
      <button className={"btn "+(this.props.className||" btn-success ")+(this.state.disabled ? " disabled " : '')} type='button' onClick={::this.handleClick}>

        <i className={this.state.loading ? "fa fa-spinner fa-spin" : this.props.icon||'fa fa-plus'} style={{marginRight: 10}}/>


        {this.props.text||'Button'}
      </button>
    );

  }

}
