const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ItemSchema = new Schema({
  name: {
    type: String,
    default: '',
  },
  ids: {
    type: [Number],
    required: true,
  },
});
module.exports = Item = mongoose.model('item', ItemSchema);
