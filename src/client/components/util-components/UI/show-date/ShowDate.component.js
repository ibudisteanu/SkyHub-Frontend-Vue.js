/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/19/2017.
 * (C) BIT TECHNOLOGIES
 */

import React from 'react';

export default class ShowDate extends React.Component {

  constructor(props) {
    super(props);
  }

  calculateDateDiff() {

    let myDate = this.props.date;

    if ((typeof myDate === "undefined")||(myDate === null)) {
      return 'now';
    }

    let dateNow = new Date();
    myDate = new Date(myDate);

    let diff = dateNow - myDate;

    let diffYears =  Math.trunc(diff / (1000 * 60 * 60 * 24 * 30 * 12));
    let diffMonths = Math.trunc(diff / (1000 * 60 * 60 * 24 * 30));
    let diffDays =   Math.trunc(diff / (1000 * 60 * 60 * 24));

    // console.log("my date",myDate, dateNow, dateNow-myDate);
    // console.log("diff", diff, diffYears, diffMonths, diffDays);

    let result = '';

    if (diffYears > 0){
      result = diffYears+'y ';

      if (diffMonths > 0) return result+diffMonths + 'm ';
      if (diffDays > 0) return result+diffDays + 'd ';

      return result;
    }

    let diffHours = Math.trunc(diff / (1000 * 60 * 60));

    if (diffMonths > 0){
      result = diffMonths + 'm ';
      if (diffDays > 0) return result+diffDays + 'd ';
      if (diffHours > 0) return result+diffHours + 'h ';

      return result;
    }

    let diffMinutes = Math.trunc(diff / (1000 * 60));

    if (diffDays > 0){
      result = diffDays + ' d ';
      if (diffHours > 0) return result + diffHours + 'h ';
      if (diffMinutes > 0) return result +diffMinutes+'m ';

      return result;
    }

    let diffSeconds = Math.trunc(diff / 1000);

    if (diffHours > 0){
      result = diffHours + ' h ';
      if (diffMinutes > 0) return result + diffMinutes + 'm ';
      if (diffSeconds > 0) return result + diffSeconds + 's ';
    } else
    if (diffSeconds > 0){
      result = diffSeconds + 's ';
    } else
    result = 'now';

    return result;

  }

  getFullDate(){
    let myDate = this.props.date;

    if ((typeof myDate === "undefined")||(myDate === null)) {
      return 'now';
    }

    myDate = new Date(myDate);

    return myDate.toString();
  }

  render(){

    return (

      <span className="time" data-toggle="tooltip" data-placement="right" title={::this.getFullDate()}> <i className="fa fa-clock-o"></i> {::this.calculateDateDiff()} </span>


    );

  }

}
