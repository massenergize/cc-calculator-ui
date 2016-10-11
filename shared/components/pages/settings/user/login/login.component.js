/*global module*/

import React from 'react';
import Panel from 'shared/lib/base_classes/panel';
import template from './login.rt.html';
import { validateParameter } from 'shared/lib/utils/utils';
import authContainer from 'shared/containers/auth.container';
import { authPropTypes } from 'shared/containers/auth.container';

class LoginComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    let login = this;
    login.valid = {
      email: false,
      password: false
    };
    login.state = {
      email: '',
      password: ''
    };
  }

  render() {
    return template.call(this);
  }

  get alert_list() {
    return this.props.ui.getIn(['alerts', 'login']).toJS();
  }

  paramValid(param){
    let login = this;

    if(login.state[param].length > 0) {
      return login.valid[param];
    } else {
      return true;
    }
  }

  validateAll(){
    let login = this,
        all_valid = Object.values(login.valid).filter(item => item === false);
    if (all_valid.length>0) {
      let alerts = {
        id: 'login',
        data: []
      };
      for (let key in login.valid) {
        if (login.valid[key] === false) {
          let item = {
            type: 'danger',
            message: login.t('login.' + key) + ' ' + login.t('errors.invalid')
          };
          alerts.data.push(item)
        }
      }
      login.props.pushAlert(alerts)
      return false;
    }
    return true;
  }

  updateInput(event) {
    event.preventDefault();

    let login = this,
        api_key = event.target.dataset.api_key,
        update = {
          [api_key]: event.target.value
        };

    login.valid[api_key] = validateParameter(update);
    login.setState(update);
  }

  submitLogin(event) {
    event.preventDefault();
    if (this.validateAll()) this.props.login(this.state);
  }
}

LoginComponent.NAME = 'Login';
LoginComponent.propTypes = authPropTypes;

module.exports = authContainer(LoginComponent);
