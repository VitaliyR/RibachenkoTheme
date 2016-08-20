/**
 * @module app/js/core
 */

var Base = require('./base');

/**
 * @class Store
 * @export
 */
var Store = module.exports = Base.extend({

  /**
   * @constructor
   * @param {string} namespace
   */
  constructor: function(namespace) {
    this.namespace = namespace;

    try {
      this.data = JSON.parse(localStorage.getItem(namespace)) || {};
    } catch (e) {
      this.data = {};
    }
  },

  /**
   * Get data from storage
   * @param {string} key
   * @returns {*}
   */
  get: function(key) {
    return this.data[key];
  },

  /**
   * Set data to storage and persist it
   * @param {string} key
   * @param {*} data
   */
  set: function(key, data) {
    this.data[key] = data;
    this.persist();
  },

  /**
   * Saves data to localStorage
   */
  persist: function() {
    var data = JSON.stringify(this.data);
    localStorage.setItem(this.namespace, data);
  }

}, {

  /**
   * Returns new exemplar of Store class
   * @param namespace
   */
  register: function(namespace) {
    return new Store(namespace);
  }

});
