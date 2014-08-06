# indico.io

A Node.js wrapper for the Indico's API.

### Getting started 

Install with [npm](http://npmjs.org/)

```
npm install indico.io
```

### API

Right now this wrapper supports the following apps:

- Political Sentiment Analysis
- Spam Detection
- Positive/Negative Sentiment Analysis
- Facial Emotion Recognition
- Facial Feature Extraction

### Using the library

```js
var indico = require('indico.io');

function fn(err, res) {
  if (err) {
    console.log('err: ', err);
    return;
  }

  console.log(res);
}

// Calls to the API are chainable
indico
  .political('Guns don\'t kill people. People kill people.', fn)  // {Libertarian: 0.22934946808893228, Liberal: 0.2025395008382684, Green: 0.0, Conservative: 1.0}
  .sentiment('Worst movie ever.', fn) // {Sentiment: 0.07062467665597527}
  .sentiment('Really enjoyed the movie.'); // {Sentiment: 0.8105182526856075}
  .language('Quis custodiet ipsos custodes') // {u'Swedish': 0.00033330636691921914, u'Lithuanian': 0.007328693814717631, u'Vietnamese': 0.0002686116137658802, u'Romanian': 8.133913804076592e-06, u'Dutch': 0.09380619821813883, u'Korean': 0.00272046505489883, u'Danish': 0.0012556466207667206, u'Indonesian': 6.623391878530033e-07, u'Latin': 0.8230599921384231, u'Hungarian': 0.0012793617391960567, u'Persian (Farsi)': 0.0019848504383980473, u'Turkish': 0.0004606965429738638, u'French': 0.00016792646226101638, u'Norwegian': 0.0009179030069742254, u'Russian': 0.0002643396088456642, u'Thai': 7.746466749651003e-05, u'Finnish': 0.0026367338676522643, u'Spanish': 0.011844579596827902, u'Bulgarian': 3.746416283126873e-05, u'Greek': 0.027456554742563633, u'Tagalog': 0.0005143018200605518, u'English': 0.00013517846159760138, u'Esperanto': 0.0002599482830232367, u'Italian': 2.650711180999111e-06, u'Portuguese': 0.013193681336032896, u'Chinese': 0.008818957727120736, u'German': 0.00011732494215411359, u'Japanese': 0.0005885208894664065, u'Czech': 9.916434007248934e-05, u'Slovak': 8.869445598583308e-05, u'Hebrew': 3.70933525938127e-05, u'Polish': 9.900290296255447e-05, u'Arabic': 0.00013589586110619373}

/*
  testFace is an array in the same format as 
  numpy.linspace(0, 50, 48*48).reshape(48,48).tolist()
  
  You can find two examples of this data structure in ./test/data.json
*/
var testFace = [...];

indico
  .facialFeatures(testFace, fn) // [0.0, -0.02568680526917187, ... , 3.0342637531932777]
  .fer(testFace, fn); // {Angry: 0.08843749137458341, Sad: 0.39091163159204684, Neutral: 0.1947947999669361, Surprise: 0.03443785859010413, Fear: 0.17574534848440568, Happy: 0.11567286999192382}

```

### License

See the `LICENSE.md` file.
