/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    channel: {
      model: 'channel'
    },

    poster: { // would normally be user model
      type: 'string'
    },

    content: {
      type: 'string'
    }

  }
};
