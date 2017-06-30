/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/11/2017.
 * (C) BIT TECHNOLOGIES
 */


<template>
  <div class="modal inmodal in" :key="'modal'+myModalId"  ref="refModal"  role="dialog" aria-hidden="true" >
      <div class="modal-dialog">
          <div :class="'modal-content ' + (animation||myAnimation)" >

                <div class="modal-header">

                  <button v-show="(closable||myClosable)" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>

                  <h4 v-show="title !== ''" class="modal-title">{{title}}</h4>

                  <small v-show="(subTitle||mySubTitle) !== ''" class="font-bold">{{(subTitle||mySubTitle)}}</small>

                </div>


                <div class="modal-body">

                  <p v-show="body !== ''">{{(body||myBody)}}</p>

                  <slot name="modal-content" />

                </div>

                <div v-if="showButtons" class="modal-footer">


                    <button
                            v-for="(button, index) in (buttons||myButtons)"
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

      data: function () {
          return {
              myModalId: 'modal-sample',
              myIsModalOpen: false,
              myTitle: 'TITLE',
              mySubTitle: 'SUB TITLE',
              myBody: 'BODY',
              myClosable: true,
              myButtons: function () {
                      return [{className: 'btn-white', closable: true, text: 'Close'}, {
                          className: 'btn-primary',
                          closable: false,
                          text: 'Save'
                      }]
                  },
              myAnimation: 'animated flipInY',
          }
      },

      props: ['title','subTitle','body','closable','buttons','animation'],

      computed:{

          showBody(){
              return (typeof this.body !== "undefined");
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

          handleToggle(){
              if (this.myIsModalOpen === true) this.hideModal();
              else  this.showModal();
          }
      }
  }
</script>
