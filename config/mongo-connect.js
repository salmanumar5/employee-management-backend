var mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.Promise = global.Promise;

mongoose.set('debug', true);

function connectTodb() {
  var baseURL = process.env.MONGO_URI;

  console.log(baseURL);
  
  mongoose.connect(baseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch((err) => {
    console.log(err);
  })

}

module.exports = { connectTodb };
