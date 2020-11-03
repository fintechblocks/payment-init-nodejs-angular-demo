import * as _ from 'lodash';
import { Injectable } from '@angular/core';

@Injectable()
export class HelpersService {
  constructor() { }

  cleanObjectsFromEmptyElements(obj) {
    return removeEmptyObjects(obj);
  }  

  generateIdempotencyKey() {
    return this.randomString();
  }

  randomString() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
    let randomString = "";
    const STRING_LENGTH = 15;
    for (var x = 0; x < STRING_LENGTH; x++) {
      var i = Math.floor(Math.random() * chars.length);
      randomString += chars.charAt(i);
    }
    return randomString;
  }
}
/**clean request body recursively */
function removeEmptyObjects(input) {  
  if (typeof input == 'string' && !_.isEmpty(input)) {
    return input;
  }

  if (_.isArray(input)) {
    return  _(input)
      .map(removeEmptyObjects)
      .reject(_.isEmpty)
      .value();
  }  

  return _(input)
    .pickBy(_.isObject) // pick objects only
    .mapValues(removeEmptyObjects) // call only for object values
    .omitBy(_.isEmpty) // remove all empty objects
    .assign(_.omitBy(input, isObjectOrEmpty)) // assign back primitive values
    .value();
}

function isObjectOrEmpty(obj) {
  return _.isObject(obj) || _.isEmpty(obj);
}