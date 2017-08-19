/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/11/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>
  <div class="modal inmodal in" :key="'modal'+(getModalId)"  ref="refModal"  role="dialog" aria-hidden="true" >
      <div class="modal-dialog">
          <div :class="'modal-content ' + (getAnimation)" >

                <div class="modal-header">

                  <button v-show="getClosable" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>

                  <h4 v-show="getTile !== ''" class="modal-title">{{getTile}}</h4>

                  <small v-show="getSubTitle !== ''" class="font-bold">{{getSubTitle}}</small>

                </div>


                <div class="modal-body">

                  <div v-show="getBody !== ''">
                      <p v-html="getBody">

                      </p>

                      <div v-if="getError !== ''">
                          <div class="alert alert-danger alert-dismissable" >
                              <div v-html="getError" />
                          </div>
                      </div>
                  </div>

                  <slot name="modal-content" />

                </div>

                <div v-if="showButtons" class="modal-footer">


                    <button
                            v-for="(button, index) in (getButtons)"
                            :key="'modalButton_modal'+(getModalId)+'_'+index"
                            :class="'btn '+button.className||''"
                            @click="(typeof button.onClick !== 'undefined' ? button.onClick() :  ( (button.closable||false) === true ? closeModal() : '') )"
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

      data: function () {
          return {
              myModalId: '',
              myIsModalOpen: false,
              myTitle: '',
              mySubTitle: '',
              myBody: '',
              myClosable: false,
              myButtons: [],
              myAnimation: '',
              myError: '',
          }
      },

      props:{
          'modalId': {default: 'modal-sample'},
          'isModalOpen': {default: false},
          'title': {default: "TITLE" },
          'subTitle': {default: '' },
          'body': {default: '' },
          'closable': {default: true },
          'buttons': {
              default: function () {
                  return [{className: 'btn-white', closable: true, text: 'Close'}, {
                      className: 'btn-primary',
                      closable: false,
                      text: 'Save'
                  }]
              }
          },
          'animation': {default: 'animated flipInY' },
      },

      computed:{

          getModalId(){
              return this.myModalId||this.modalId;
          },
          getModalOpen(){
              return this.myIsModalOpen||this.isModalOpen ;
          },
          getTile(){
              return this.myTitle||this.title ;
          },
          getSubTitle(){
              return this.mySubTitle||this.subTitle;
          },
          getBody(){
              return this.myBody ||this.body;
          },
          getClosable(){
              return this.myClosable||this.closable;
          },
          getButtons(){
              return this.myButtons||this.buttons;
          },
          getAnimation(){
              return this.myAnimation ||this.animation;
          },
          getError(){
              return this.myError;
          },


          showButtons(){

              return    ((this.buttons !== [])&&(this.buttons !== {}) && (this.buttons !== null) && (typeof this.buttons !== "undefined"))||
                        ((this.myButtons !== [])&&(this.myButtons !== {}) && (this.myButtons !== null) && (typeof this.myButtons !== "undefined"))
          },

      },

      methods: {
          showAlert(title, subTitle, body, buttons){
              this.myTitle = title;
              this.mySubTitle = subTitle;
              this.myBody = body;
              this.myClosable = true;
              this.myButtons = buttons;
              this.myAnimation = "animated flipInY";

              this.showModal();
          },

          showModal(){
              $(this.$refs['refModal']).modal("show");

              this.myIsModalOpen = true;
          },

          hideModal(){
              console.log('hiding modal...');
              $(this.$refs['refModal']).modal("hide");

              this.myIsModalOpen = false;
          },

          closeModal(){
              this.hideModal();
          },

          setError(error){
              this.myError = error;
          },

          handleToggle(){
              if (this.myIsModalOpen === true) this.hideModal();
              else  this.showModal();
          }
      }
  }
</script>
