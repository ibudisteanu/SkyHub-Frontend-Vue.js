/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/18/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <div style='background-color: aliceblue;'>

        <PreviewAllTopics hideHeader={true} topics={ [this.state.topic] } />

    </div>

</template>




<script>

    export default{

        props:{
            title: this.props.title||'',
            image: this.props.image||'',
            description: this.props.description||'',
            attachments: this.props.attachments||[],
            keywords: this.props.keywords||[],
            authorId: this.props.authorId||'',

            dtCreation: '',

            preview: true,
        },
    }


</script>

import React from 'react';

import PreviewTopic from '../view-topic/PreviewTopic.component';
import PreviewAllTopics from '../view-topic/PreviewAllTopics.component';

import Topic from '../../../../../models/Topic/Topic.model';

class PreviewNewTopic extends React.Component {

  constructor(props){
    super(props);

    this.state=({
      topic: new Topic({}),
    });

  }

  componentWillUpdate(){
    this.state.topic = new Topic({

    });
  }

  render() {

    return (



    );
  }
}

export default (PreviewNewTopic);
