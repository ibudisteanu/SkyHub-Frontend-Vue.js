/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/24/2017.
 * (C) BIT TECHNOLOGIES
 */

import React from 'react';
import {connect} from "react-redux";

import AuthService  from './../../../services/REST/authentication/Auth.service';

import AddForumForm from '../forums/components/AddForum.form'
import AddTopicForm from '../topics/components/AddTopic.form'

export default class ContentButtons extends React.Component {

    constructor(props){
        super(props);

        console.log("FORUM BUTTONS CONSTRUCTOR");

        this.componentDidUpdate();

    }

    handleAddForum(e){
        //e.preventDefault(); e.stopPropagation();

        this.setState({
            showAddForumForm : true,

            showAddTopicForm : false,
        });
    }

    handleAddTopic(e){
        e.preventDefault(); e.stopPropagation();

        this.setState({
            showAddTopicForm: true,

            showAddForumForm : false,
        });
    }

    handleAddReply(e){
        e.preventDefault(); e.stopPropagation();
    }


    showAddForum(){
        return (
            <AddForumForm parentId={this.props.parentId} parentName={this.props.parentName} />
        )
    }

    showAddTopic(){
        return (
            <AddTopicForm parentId={this.props.parentId} parentName={this.props.parentName}/>
        )
    }

    componentDidUpdate(){
      this.state = {

        parentId : this.props.parentId || '',
        parentName : this.props.parentName||'',

        showAddTopicForm : this.props.showAddTopicForm||false,
        showAddForumForm : this.props.showAddForumForm||false,
        showAddReplyForm : this.props.showAddReplyForm||false,

        btnAddTopic : this.props.btnAddTopic||true,
        btnAddForum : this.props.btnAddForum||true,
        btnAddReply : this.props.btnAddReply||true,
      };
      console.log('componentDidUpdate');
    }

    componentDidMount(){
      console.log('componentDidMount');
    }

    render() {

        return (

            <div>

                <div style={this.props.style}>

                    {this.state.btnAddForum ? (
                        <button type="button" className="btn btn-warning dim btn-rounded" data-toggle="button" aria-pressed="true"  onClick={::this.handleAddForum} style={{marginRight: 5}} >
                            <i className="fa fa-users" style={{marginRight: 5}}  />
                            Forum
                        </button>
                    ) : '' }

                    {this.state.btnAddTopic ? (
                        <button type="button" className="btn btn-success dim btn-rounded" onClick={::this.handleAddTopic} style={{marginRight: 5}} >
                            <i className="fa fa-pencil" style={{marginRight: 5}}  />
                            Topic
                        </button>
                    ) : '' }

                    {this.state.btnAddReply ? (
                        <button type="button" className="btn btn-danger dim btn-rounded" onClick={::this.handleAddTopic} style={{marginRight: 5}} >
                            <i className="fa fa-comment" style={{marginRight: 5}}  />
                            Reply
                        </button>
                    ) : '' }

                </div>

                {this.state.showAddForumForm ? this.showAddForum() : ''}

                {this.state.showAddTopicForm ? this.showAddTopic() : ''}

            </div>
        );
    }
}
