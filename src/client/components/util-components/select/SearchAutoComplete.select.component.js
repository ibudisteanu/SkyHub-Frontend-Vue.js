/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */
import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {connect} from 'react-redux';

import SocketService from 'services/communication/client-socket/ClientSocket.service';

class SearchAutoComplete extends React.Component {

  constructor(props){

    super(props);

    this.state = {
      backspaceRemoves : false,
      creatable : true, //you need to select ... cuz it is a search

      value: props.value||'',
    };
  }


  onChange (value) {
    this.setState({
      value: value,
    });

    let answer;
    if ((this.props.multi||false)===true){//multiple keywords

      if (!Array.isArray(value)) value = [value];

      answer = [];
      value.forEach (function(element){
        answer.push({
          value: element.value,
          lbabel: element.label,
        })
      });

    } else { //just value
      answer = {
        value: value.value,
        label: value.label,
      };
    }

    console.log("AUTOCOMPLETE:: ",answer);

    let onSelect = this.props.onSelect||function(){};
    onSelect(answer);
  }


  getSuggestions( input){

    if (!input)
      return Promise.resolve({ options: [] });

    return new Promise((resolve)=>{

      SocketService.sendRequestGetData("search/parents", {text: input}).then ((data)=>{

        if (data === null) { resolve ({options: []}); console.log("ERROR getting keywords "); }
        else {

          console.log("DATA",data);

          var options = [];
          data.forEach(function (entry){
            if (entry !== input)
              options.push({
                value: entry.id,
                label: entry.text,
              });
          });

          resolve ({options: options});

        }

      });

    });
  }

  render () {``

    const AsyncSelectComponent = this.state.creatable
      ? Select.AsyncCreatable
      : Select.Async;

    return (
      <div className="section">

        {(this.props.label||'') !== '' ? (<h3 className="section-heading">{this.props.label}</h3>) : '' }

        <AsyncSelectComponent  multi={this.props.multi||false}  value={ (this.state.value === '' ? this.props.value : this.state.value) } onChange={::this.onChange} valueKey="value" labelKey="label" loadOptions={::this.getSuggestions} backspaceRemoves={this.state.backspaceRemoves} placeholder={this.props.placeholder||"select"} clearable={(typeof this.props.clearable !== "undefined" ? this.props.clearable : true)} />

      </div>
    );
  }
}

export default SearchAutoComplete;
