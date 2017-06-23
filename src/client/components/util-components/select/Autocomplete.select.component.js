/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/25/2017.
 * (C) BIT TECHNOLOGIES
 */
import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import jsonp  from 'jsonp';
import {connect} from 'react-redux';

class AutoCompleteSelect extends React.Component {

    displayName: 'GithubUsers';

    constructor(props){

        super(props);

        this.state = {
            backspaceRemoves : false,
            creatable : true,

            value: props.value||'',
        };
    }


    handleChange (value) {

        console.log("handleChange",value);

        this.setState({
            value: value,
        });

        let answer;
        if ((this.props.multi||false)===true){//multiple keywords

            if (!Array.isArray(value)) value = [value];

            answer = [];
            value.forEach (function(element){
                answer.push(element.hasOwnProperty('value') ? element.value : element);
            });

        } else//just value
            answer = (value.hasOwnProperty('value') ? value.value : value);

        console.log("AUTOCOMPLETE:: ",answer);

        let onSelect = this.props.onSelect||function(){};

        if (typeof answer !== "undefined" )
          onSelect(answer);
    }

    handleInputChange(inputValue){

      if (this.props.multi === true) return;
      if (this.props.selectOnClickOnly === true) return;

      this.handleChange({value:inputValue, label: inputValue});
      return inputValue;
    }

    getSuggestionsGitHub (input) {
        if (!input)
            return Promise.resolve({ options: [] });

        return fetch(`https://api.github.com/search/users?q=${input}`)
            .then((response) => response.json())
            .then((json) => {
                return { options: json.items };
            });
    }



    //using Google http://google.com/complete/search?client=firefox&hl=ro&q=theory
    getSuggestions( input){

      if (!input)
        return Promise.resolve({ options: [] });

      return new Promise((resolve)=>{


        jsonp('http://google.com/complete/search?client=firefox&hl='+(this.props.localization.countryCode||'us')+'&q='+input, null, function (err, data) {
          if (err) {
            console.error('Error getting KEYWORDS '+err.message);
            resolve ({options: []});
          } else {
            //console.log({options: data[1]});

            var keywords = data[1];
            var optionsKeywords = [];
            keywords.forEach(function (entry){
              if (entry !== input)
              optionsKeywords.push({
                value: entry,
                label: entry,
              });
            });

            //console.log({options: optionsKeywords});

            resolve ({options: optionsKeywords});
          }
        });

      });
    }

    render () {

        const AsyncSelectComponent = this.state.creatable
            ? Select.AsyncCreatable
            : Select.Async;

        return (
            <div className="section">

                {(this.props.label||'') !== '' ? (<h3 className="section-heading">{this.props.label}</h3>) : '' }

                <AsyncSelectComponent onInputChange={::this.handleInputChange}  multi={this.props.multi||false}  value={this.state.value||this.props.value} onChange={::this.handleChange} valueKey="value" labelKey="label" loadOptions={::this.getSuggestions} backspaceRemoves={this.state.backspaceRemoves} placeholder={this.props.placeholder||"select"} clearable={(typeof this.props.clearable !== "undefined" ? this.props.clearable : true)} />

            </div>
        );
    }
}

function mapState (state){
  return {
    localization: state.localization,
  }
};

function mapDispatch (dispatch) {
  return {
    dispatch : dispatch,
  }
};

export default connect(mapState, mapDispatch)(AutoCompleteSelect);
