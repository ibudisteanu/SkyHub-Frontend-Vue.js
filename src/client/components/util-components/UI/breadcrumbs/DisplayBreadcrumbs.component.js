/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/20/2017.
 * (C) BIT TECHNOLOGIES
 */

import React from 'react';
import Link from '../../../../components/Link/Link';

export default class DisplayBreadcrumbs extends React.Component {

  renderBreadcrumbs(){

    let breadcrumbs = [];
    if (typeof this.props.breadcrumbs !== "undefined")  breadcrumbs = this.props.breadcrumbs;

    console.log("LENGTH BREADCRUMBS %%%%%%%%%%% ",breadcrumbs);

    if ((breadcrumbs === null)||(typeof breadcrumbs === "undefined")||(breadcrumbs === [])) return '';

    return (
      breadcrumbs.map((object, index) =>
        <li key={"breadcrumb"+index} >
          <Link key={"breadcrumbLink"+index} to={object.url} > {object.name} </Link>
        </li>
      )
    );
  }

  render(){
    return (
      <ol className="breadcrumb" >

        {
          (this.props.currentPageUrl !== "/")
          ?
            <li key="breadcrumb_home">
            <a href={"/"}>Home</a>
            </li>
          :
          ''
        }


        {::this.renderBreadcrumbs()}

        <li className="active" key="breadcrumbCurrentPage">
          <Link key="breadcrumbCurrentPageLink" to={this.props.currentPageUrl} > {this.props.currentPageTitle} </Link>

        </li>


      </ol>
    )
  }

}
