/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/11/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>
  <div class="modal inmodal in" :key="'modal'+modalId"  ref="refModal"  role="dialog" aria-hidden="true" >
      <div class="modal-dialog">
          <div :class="'modal-content ' + animation" >

                <div class="modal-header">

                  <button v-show="closable" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>

                  <h4 v-show="title !== ''" class="modal-title">{{title}}</h4>

                  <small v-show="subTitle !== ''" class="font-bold">{{subTitle}}</small>

                </div>


                <div v-show="showBody" class="modal-body">

                  <p v-show="body !== ''">{{body}}</p>

                  <slot name="modal-content" />

                </div>

                <div v-if="showButtons" class="modal-footer">

                    
                    <button
                            v-for="(button, index) in buttons"
                            :key="'modalButton_modal'+modalId+'_'+index"
                            :class="'btn '+button.className||''"
                            @click="button.onClick()"
                            :data-dimiss="(button.closable||false) === true"
                    >
                        {{button.text||''}}
                    </button>

                </div>


          </div>
      </div>
  </div>
</template>

<script>
  export default{
      name: 'ModalComponent',

      props: {
          modalId: {default: 'modal-sample'},
          isModalOpen: {default: false},
          title: {default: 'TITLE'},
          subTitle: {default: 'SUB TITLE'},
          body: {default: 'BODY'},
          closable: {default: true},
          buttons: {default: function(){return [ {className: 'btn-white', closable: true, text: 'Close'}, {className:'btn-primary', closable:false, text:'Save'}] }},
          animation: {default: 'animated flipInY'},
      },

      computed:{

          showBody(){
              return (typeof this.body !== "undefined");
          },

          showButtons(){
              return (this.buttons !== []) && (this.buttons !== null) && (typeof this.buttons !== "undefined")
          },

      },

      methods: {
          showAlert(title, subTitle, body, buttons){
              this.title = title;
              this.subTitle = subTitle;
              this.body = body;
              this.closable = true;
              this.buttons = buttons;
              this.animation = "animated flipInY";

              this.showModal();
          },

          showModal(){
              $(this.$refs['refModal']).modal("show");

              this.isModalOpen = true;
          },

          hideModal(){
              $(this.$refs['refModal']).modal("hide");

              this.isModalOpen = false;
          },

          closeModal(){
              this.hideModal();
          },

          handleToggle(){
              if (this.isModalOpen === true) this.hideModal();
              else  this.showModal();
          }
      }
  }
</script>

import React from 'react';

export default class ModalComponent extends React.Component {



  renderButtons(buttons){
    let output = [];

    if (typeof buttons === "undefined" ) return '';

    for (let i=0; i<buttons.length; i++) {
      let button = buttons[i];
      output.push(<button type="button" key={"modal"+this.props.modalId+"_Button"+i} class={"btn "+buttons[i].className||''} onClick={button.onClick||function(){}} data-dismiss={ (button.closable||false) === true ? "modal" : ''}> {button.text||''} </button>)
    }

    if (output === []) return '';

    return (
      <div class="modal-footer">
        {output}
      </div>
    )
  }

  render(){



    return (

    )
  }

}
