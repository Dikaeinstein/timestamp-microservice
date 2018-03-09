const express = require('express');
const logger = require('morgan');

const app = express();
const port = process.env.PORT || 8000;

app.use(logger('dev'));

app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Timestamp Microservice');
});

app.get('/api/:time', (req, res) => {
  const { time } = req.params;
  // Bad request
  if (!time) {
    return res.status(400).json({
      unix: null,
      natural: null,
    });
  }
  
  // Regex to match Date format Jan(uary) 01, 2018
  const naturalPattern = /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+[1-3]?\d,\s+\d{4}/i;

  // Handles natural time param
  if (naturalPattern.test(time)) {
    return res.status(200).json({
      unix: Date.parse(time),
      natural: new Date(time).toDateString(),
    });
  }

  // Handles unix time param
  return res.status(200).json({
    unix: Date.parse(new Date(parseInt(time, 10))),
    natural: new Date(parseInt(time, 10)).toDateString(),
  });
})

app.listen(port, () => { console.log(`Server listening on port: ${port}`) });
