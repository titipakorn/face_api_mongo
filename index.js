const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Connect to MongoDB
mongoose
  .connect('mongodb://mongo:27017/docker-node-mongo', { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));
const Item = require('./models');
app.use('/', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-   With, Content-Type, Accept');
  next();
});
app.get('/', (req, res) => {
  Item.find()
    .then((items) => res.json(items))
    .catch((err) => res.status(404).json({ msg: 'No items found' }));
});
app.post('/item', (req, res) => {
  if (req.body.match) {
    return Item.find({ ids: req.body.match })
      .limit(1)
      .then((items) => {
        items = items[0];
        if (req.body.id) {
          items.ids.push(req.body.id);
          items
            .save()
            .then(() => res.json({ status: 'ok', id: items._id }))
            .catch((er) => res.json({ status: 'error', msg: err }));
        } else {
          res.json({ status: 'ok', id: items._id });
        }
      })
      .catch((err) => {
        res.json({ status: 'error', msg: err });
      });
  }
  if (req.body.id) {
    Item.find({ ids: req.body.id })
      .limit(1)
      .then((item) => res.json({ status: 'ok', id: item[0]._id }))
      .catch(() => {
        const newItem = new Item();
        newItem.ids.push(req.body.id);
        newItem
          .save()
          .then((item) => res.json({ status: 'ok', id: item._id }))
          .catch((err) => res.status(404).json({ msg: err }));
      });
  } else {
    res.json({ status: 'error' });
  }
});
const port = 3000;
app.listen(port, () => console.log('Server running...'));
