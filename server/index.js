const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const user = require('./routes/user');
const message = require('./routes/messages');
const { initializeSocket } = require('./socketHandler');
const PORT = 8080;
const app = express();

require('./db/connection');
app.use(cors()); //enabiing cors
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.use('/user', user);
app.use('/message', message);

const server = app.listen(PORT, () => {
  console.log('Server started at 8080');
});

//initializing the socket
initializeSocket(server);
