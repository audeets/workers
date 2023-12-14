'use strict';

/**
 * Module dependencies
 */

import {Schema, model} from 'mongoose';

// end module dependencies

var ResultSchema = new Schema({
  timestamp: Date,
  category: String,
  url: String,
  project: {type: Schema.Types.ObjectId, ref: 'Project'},
  rules: [{
    rule: String,
    title: String,
    check: Boolean,
    details: [{
      text: String,
      link: String
    }]
  }]
});

model('Result', ResultSchema);

