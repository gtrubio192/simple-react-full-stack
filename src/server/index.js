const express = require('express');
const distance = require('google-distance-matrix');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.static('dist'));

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

app.get('/api/distance', (req, res) => {
  const origins = req.param('origins');
  const hubs = req.param('hubs').split(',');
  const mode = 'DRIVING';

  distance.key(GOOGLE_API_KEY);
  distance.units('imperial');

  distance.matrix([origins], hubs, function (err, distances) {
    if(err)
      return console.log(err);
    if(distances.status == 'OK')
      res.json(distances)
  });
})

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
