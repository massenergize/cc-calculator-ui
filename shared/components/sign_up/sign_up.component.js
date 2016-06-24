/*global module*/

import React from 'react';

import {auth} from './../../lib/auth/auth';
import Panel from './../../lib/base_classes/panel';
import template from './sign_up.rt.html'


class SignUpComponent extends Panel {

  constructor(props, context) {
    super(props, context);
    let sign_up = this;
    sign_up.valid = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    };
    sign_up.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      answers: ''
    };

  }

  componentDidMount() {
    let sign_up = this;
  }

  paramValid(param){
    let sign_up = this;

    if(sign_up.state[param].length > 0) {
      return sign_up.valid[param];
    } else {
      return true;
    }
  }

  validateInput(input) {
    let sign_up = this,
        key = Object.keys(input)[0],
        value = Object.values(input)[0],
        re;
    switch (key) {
      case "first_name":
        re = /^[A-Za-z0-9 ]{4,20}$/;
        break;
      case "last_name":
          re = /^[A-Za-z0-9 ]{4,20}$/;
          break;
      case "email":
        re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        break;
      case "password":
        re = /^[A-Za-z0-9!@#$%^&*()_]{4,30}$/;
        break;
      default:
        console.log('Unknown key: ', key);
    }
    let test = re.test(value);
    sign_up.valid[key] = test;
    console.log('%s: %s - valid:', key, value, test);
  }

  validateAll(){
    let sign_up = this,
        valid = Object.values(sign_up.valid).filter(item => item === false);
    if (valid[0] === false) {
      return false;
    } else {
      return true;
    }
  }

  updateInput(event) {
    event.preventDefault();

    let sign_up = this,
        api_key = event.target.dataset.api_key,
        update = {
          [api_key]: event.target.value
        };
    sign_up.validateInput(update);
    sign_up.setState(update);
  }

  submitSignup(event) {
    event.preventDefault();
    let sign_up = this;

    if (sign_up.validateAll()) {
      auth.signupUser(sign_up.state).then((res)=>{
        console.log('result', res)
        if (res.success) {
          // user added
        } else {
          // failed
        }
        return res
      })
    } else {
      // input not valid
    }
  }

  render() {
    return template.call(this);
  }

}

SignUpComponent.NAME = 'SignUp';

module.exports = SignUpComponent;
