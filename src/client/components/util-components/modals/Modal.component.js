/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/11/2017.
 * (C) BIT TECHNOLOGIES
 */

import React from 'react';

export default class ModalComponent extends React.Component {

  modalRef = null;

  constructor(props){
    super(props);

    this.state=({
      isModalOpen: props.showModal||true,

      title: 'TITLE',
      subTitle: 'SUB TITLE',
      body: 'BODY',
      closable: true,
      buttons: [ {className:'btn-white', closable: true, text: 'Close'}, {className: 'btn-primary', closable:false, text:'Save'}],
      animation: "animated flipInY",
    })

  }

  showAlert(title, subTitle, body, buttons){
    this.setState({
      title: title,
      subTitle: subTitle,
      body: body,
      closable: true,
      buttons: buttons,
      animation: "animated flipInY",
    });
    this.showModal();
  }

  showModal(){
    $(this.modalRef).modal("show");

    this.setState({
      isModalOpen: true,
    });
  }

  hideModal(){
    $(this.modalRef).modal("hide");

    this.setState({
      isModalOpen: false,
    });
  }

  closeModal(){
    this.hideModal();
  }

  handleToggle(){
    if (this.state.isModalOpen === true) this.hideModal();
    else  this.showModal();
  }

  renderButtons(buttons){
    let output = [];

    if (typeof buttons === "undefined" ) return '';

    for (let i=0; i<buttons.length; i++) {
      let button = buttons[i];
      output.push(<button type="button" key={"modal"+this.props.modalId+"_Button"+i} className={"btn "+buttons[i].className||''} onClick={button.onClick||function(){}} data-dismiss={ (button.closable||false) === true ? "modal" : ''}> {button.text||''} </button>)
    }

    if (output === []) return '';

    return (
      <div className="modal-footer">
        {output}
      </div>
    )
  }

  render(){

    let body = this.props.body||this.state.body;
    let children = this.props.children||null;

    let title = this.props.title||this.state.title;
    let subTitle = this.props.subTitle||this.state.subTitle;

    let closable = this.props.closable || this.state.subTitle;

    let buttons = this.props.buttons || this.state.buttons;

    let animation = this.props.animation || this.state.animation;

    return (
      <div className="modal inmodal in" key={"modal"+this.props.modalId}  ref={(c) => this.modalRef = c}  role="dialog" aria-hidden="true"   >
        <div className="modal-dialog">
          <div className={"modal-content " + (animation !== '' ? animation : '')}>
            <div className="modal-header">

              { ( closable === true) ? (<button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">×</span><span className="sr-only">Close</span></button>) : ''}

              { (title !== '') ? (<h4 className="modal-title">{title}</h4>) : ''}

              { (subTitle !== '') ? (<small className="font-bold">{subTitle}</small>) : ''}

            </div>


            {
              (((body !== '') && (typeof body !== "undefined"))||(children !== null))
              ?
              (
                <div className="modal-body">

                  {body !== '' ? (<p>{body}</p>) : ''}

                  {children}

                </div>
              )
              :
              ''
            }

            {
              (buttons !== []) && (buttons !== null) && (typeof buttons !== "undefined")
              ?
                ::this.renderButtons(buttons)
              :
              ''
            }

          </div>
        </div>
      </div>
    )
  }

}
