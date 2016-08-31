/*global module*/

import React from 'react';

import Translatable from './../../../lib/base_classes/translatable';
import template from './action.rt.html'

class ActionComponent extends Translatable {

  constructor(props, context){
    super(props, context);
    let action = this;
    action.state = {
        key: this.props.action_key,
        category: this.props.category,
        show: this.props.show,
        detailed: false
    }
  }

  get api_key(){
    return `input_takeaction_${this.state.key}`;
  }

  get result_key(){
    return `result_takeaction_${this.state.key}`;
  }

  get display_name(){
    return this.t(`actions.${this.state.category}.${this.state.key}.label`);
  }

  get fact(){
    let fact = this.t(`actions.${this.state.category}.${this.state.key}.fact`, {defaultValue: ""});

    if (fact.length > 0) {
      return fact
    } else {
      return false;
    }
  }

  get rebates(){
    return this.t(`actions.${this.state.category}.${this.state.key}.rebates`, {returnObjects: true});
  }

  get taken(){
    return parseInt(this.userApiValue(this.api_key)) === 1;
  }

  get is_shown_detailed(){
    return this.state.detailed
  }

  get content(){
    return this.t(`actions.${this.state.category}.${this.state.key}.content`, {returnObjects: true});
  }

  get assumptions_content(){
    return this.t(`critical_assumptions.content`, {returnObjects: true});
  }

  get tons_saved(){
    return this.numberWithCommas(
      Math.round(this.result_takeaction_pounds[this.state.key] * 100) / 100
    );
  }

  get result_takeaction_pounds(){
    return this.state_manager['result_takeaction_pounds'];
  }

  get result_takeaction_dollars(){
    return this.state_manager['result_takeaction_dollars'];
  }

  get result_takeaction_net10yr(){
    return this.state_manager['result_takeaction_net10yr'];
  }


  get dollars_saved(){
    return this.numberWithCommas(
      Math.round(this.result_takeaction_dollars[this.state.key]));
  }

  get upfront_cost(){
    return this.numberWithCommas(
      Math.round(this.result_takeaction_net10yr[this.state.key]));
  }

  toggleAction(){
    let action = this,
      update = {};
    if (this.taken){
      update[this.api_key] = 0;
    } else {
      update[this.api_key] = 1;
    }
    action.setState(update);
    action.updateTakeaction(update);
  }

  toggleActionDetails(){
    let action = this;

    let update = {},
    status = action.state.detailed;
    update['detailed'] = !status;
    action.setState(update);
  }

  setInputState(id){
    let take_action = this,
    footprint = take_action.state_manager.state.user_footprint;
    return footprint[id]
  }

  displayStateValue(id, suffix){
    if (id.includes('display_takeaction')) {
      id = id.replace(/display_takeaction/i, 'input_takeaction')
    }
    if (!suffix) {
      return this.state_manager.state.user_footprint[id]
    } else {
      return this.state_manager.state.user_footprint[id] + ' ' + suffix
    }
  }

  updateActionInput(event){
    let action = this,
        val = event.target.value,
        id = event.target.id,
        update = {};

    update[id] = val;
    update['input_changed'] = id;
    action.setState(update);
    action.updateTakeaction(update);
  }

  setSelectOptions(select) {
    if (select.type === 'vehicle') {

      let options = [], i = 1;
      this.state_manager.state.vehicles.forEach((v) => {
        let vehicle = {};
        vehicle.value = i;
        vehicle.text = 'Vehicle ' + i;
        i++;
        options.push(vehicle);
      })
      return options;

    } else {
      return select.options
    }
  }

  handleChange(event){
    let i = event.target.value,
    is_vehicle = event.target.id.lastIndexOf('vehicle_select'),
    action_key = event.target.dataset.action_key,
    id = event.target.id;

    if (is_vehicle > 0) {
      this.selectVehicle(i, action_key)
    } else {
      let update = {};
      update[id] = i;
      this.setState(update);
      this.updateTakeaction(update);
    }
  }

  getSelectedOption(id){
    let is_vehicle = id.lastIndexOf('vehicle_select'),
    footprint = this.state_manager.state.user_footprint,
    key = this.state.key,
    mpg;

    if (is_vehicle > 0) {
        if (key === 'ride_my_bike' || key ===  'telecommute_to_work' || key ===  'take_public_transportation') {
          mpg = footprint['input_takeaction_' + key + '_mpg'];
        } else {
          mpg = footprint['input_takeaction_' + key + '_mpg_old'];
        }

        for (let i = 1; i <= 10; i++){
          let fp_mpg = footprint[`input_footprint_transportation_mpg${i}`];
          if (fp_mpg === mpg) {
            return i
          }
        }
    } else {
      return this.state_manager.state.user_footprint[id]
    }
  }

  selectVehicle(i, action_key){

    let footprint = this.state_manager.state.user_footprint,
    v_miles = footprint[`input_footprint_transportation_miles${i}`],
    v_mpg = footprint[`input_footprint_transportation_mpg${i}`],
    update = {};

    if (action_key === 'ride_my_bike' || action_key ===  'telecommute_to_work' || action_key ===  'take_public_transportation') {
      update['input_takeaction_' + action_key + '_mpg'] = parseInt(v_mpg);
      this.setState(update);
      this.updateTakeaction(update);

    } else {
      update['input_takeaction_' + action_key + '_mpg_old'] = parseInt(v_mpg);
      update['input_takeaction_' + action_key + '_miles_old'] = parseInt(v_miles);
      this.setState(update);
      this.updateTakeaction(update);
    }
  }

  userApiValue(api_key){
    return this.state_manager.user_footprint[api_key];
  }

  userApiState(){
    let action = this,
    hash = {},
    keys = Object.keys(action.state_manager.user_footprint)
      .filter(key=> key.includes(action.result_key))

    return keys.reduce((hash, api_key)=>{
      hash[api_key] = action.userApiValue(api_key);
      return hash;
    }, {});
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  updateFootprintParams(params){
    this.state_manager.updateFootprintParams(params);
  }

  updateTakeaction(params){
    let action = this;

    action.state_manager.update_in_progress = true;
    action.updateFootprintParams(params);

    if (action.$update_takeaction) {
      clearTimeout(action.$update_takeaction);
    }

    action.$update_takeaction = setTimeout(()=>{
      action.state_manager.updateTakeactionResults()
        .then(()=>{
          let user_api_state = action.userApiState();
          action.setState(user_api_state, ()=>{
            action.state_manager.update_in_progress = false;
          })
        })
        .then(()=> {
          action.state_manager.syncLayout().then(() => {})
        })
    }, 500);
  }

  componentDidMount(){
    if (this.category === 'transportation') this.selectVehicle(1, this.key);
  }

  render(){
    return template.call(this);
  }

}

ActionComponent.propTypes = {
  is_assumption: React.PropTypes.bool.isRequired,
  action_key: React.PropTypes.string,
  category: React.PropTypes.string,
  show: React.PropTypes.bool
};

ActionComponent.NAME = 'Action';

module.exports = ActionComponent;
