const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const app = express();

const keys = require('./config/keys');
const path = require('path');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
require('./services/Passport');

mongoose.connect(keys.mongoURI);

const PORT = process.env.PORT || process.env.NODE_ENV === 'production' ? 80 : 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: [keys.cookieHash],
    maxAge: 7 * 24 * 60 * 60 * 1000
}));

app.use(passport.initialize());
app.use(passport.session());

require('./services/Chat')(app);

require('./routes/dbRoutes')(app);
require('./routes/flashRoutes')(app);
require('./routes/authRoutes')(app);
require('./routes/userRoutes')(app);
require('./routes/categoryRoutes')(app);
require('./routes/auctionRoutes')(app);
require('./routes/otherUserRoutes')(app);
require('./routes/invoiceRoutes')(app);
require('./routes/chatRoutes')(app);
require('./routes/przelewy24Routes')(app);
require('./routes/adminRoutes')(app);

require('./services/cronScheduleTaskService')(app);

if (process.env.NODE_ENV === 'production') {
    console.log('in production');
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
       res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });

   // SSL CERT
   const privateKey = fs.readFileSync('./cert/privkey.pem', 'utf8');
   const certificate = fs.readFileSync('./cert/cert.pem', 'utf8');
   const ca = fs.readFileSync('./cert/chain.pem', 'utf8');

   const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca
   };

  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(443, () => {
      console.log('HTTPS Server running on port 443');
  });
  const httpServer = http.createServer((req, res) => {
      res.writeHead(301,{Location: `https://${req.headers.host}${req.url}`});
      res.end();
  });

  httpServer.listen(80);
} else {
    app.listen(PORT, () => console.log(`Server launched on port ${ PORT }`));
}