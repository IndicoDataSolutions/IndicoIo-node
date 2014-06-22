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
  .spam('Free cat!', fn) // {Ham: 0.0, Spam: 1.0}
  .sentiment('Worst movie ever.', fn) // {Sentiment: 0.07062467665597527}
  .sentiment('Really enjoyed the movie.'); // {Sentiment: 0.8105182526856075}

/*
  test_face is an array in the same format as 
  numpy.linspace(0, 50, 48*48).reshape(48,48).tolist()
  
  You can find two examples of this data structure in ./test/data.json
*/
var test_face = [...];

indico
  .facial_features(test_face, fn) // [0.0, -0.02568680526917187, ... , 3.0342637531932777]
  .fer(test_face, fn); // {Angry: 0.08843749137458341, Sad: 0.39091163159204684, Neutral: 0.1947947999669361, Surprise: 0.03443785859010413, Fear: 0.17574534848440568, Happy: 0.11567286999192382}

```

### License

See the `LICENSE.md` file.
