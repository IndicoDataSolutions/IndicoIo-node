# indico.io

A Node.js wrapper for the Indico's API.

### Getting started 

Install with [npm](http://npmjs.org/)

```
npm install indico.io
```

Documentation
------------
Found [here](http://indico.readme.io/v2.0/docs)

### API

Right now this wrapper supports the following apps:

- Sentiment Analysis
- Text Tagging
- Political Analysis
- Language Detection
- Facial Emotion Recognition
- Image Feature Extraction
- Facial Feature Extraction

### Using the library

```javascript
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
  .political('Guns don\'t kill people. People kill people.', fn)  // { Libertarian: 0.47740164630834825, Liberal: 0.16617097211030055, Green: 0.08454409540443657, Conservative: 0.2718832861769146}
  .sentiment('Worst movie ever.', fn) // {Sentiment: 0.07062467665597527}
  .sentiment('Really enjoyed the movie.') // {Sentiment: 0.8105182526856075}
  .language('Quis custodiet ipsos custodes') // {u'Swedish': 0.00033330636691921914, u'Lithuanian': 0.007328693814717631, u'Vietnamese': 0.0002686116137658802, u'Romanian': 8.133913804076592e-06, u'Dutch': 0.09380619821813883, u'Korean': 0.00272046505489883, u'Danish': 0.0012556466207667206, u'Indonesian': 6.623391878530033e-07, u'Latin': 0.8230599921384231, u'Hungarian': 0.0012793617391960567, u'Persian (Farsi)': 0.0019848504383980473, u'Turkish': 0.0004606965429738638, u'French': 0.00016792646226101638, u'Norwegian': 0.0009179030069742254, u'Russian': 0.0002643396088456642, u'Thai': 7.746466749651003e-05, u'Finnish': 0.0026367338676522643, u'Spanish': 0.011844579596827902, u'Bulgarian': 3.746416283126873e-05, u'Greek': 0.027456554742563633, u'Tagalog': 0.0005143018200605518, u'English': 0.00013517846159760138, u'Esperanto': 0.0002599482830232367, u'Italian': 2.650711180999111e-06, u'Portuguese': 0.013193681336032896, u'Chinese': 0.008818957727120736, u'German': 0.00011732494215411359, u'Japanese': 0.0005885208894664065, u'Czech': 9.916434007248934e-05, u'Slovak': 8.869445598583308e-05, u'Hebrew': 3.70933525938127e-05, u'Polish': 9.900290296255447e-05, u'Arabic': 0.00013589586110619373}
  .texttags("This coconut green tea is amazing."); // {u'food': 0.3713687833244494, u'cars': 0.0037924017632370586, ...}

/*
  testFace is an array in the same format as 
  numpy.linspace(0, 50, 48*48).reshape(48,48).tolist()
  
  You can find two examples of this data structure in ./test/data.json
*/
var testFace = [...];

indico
  .facialfeatures(testFace, fn) // [0.0, -0.02568680526917187, ... , 3.0342637531932777]
  .fer(testFace, fn); // {Angry: 0.08843749137458341, Sad: 0.39091163159204684, Neutral: 0.1947947999669361, Surprise: 0.03443785859010413, Fear: 0.17574534848440568, Happy: 0.11567286999192382}

```

###Batch

Batch requests allow you to process larger volumes of data more efficiently by grouping many examples into a single request.  Simply call the batch method that corresponds to the API you'd like to use, and ensure your data is wrapped in an array.

```javascript
var indico = require('indico.io')

function fn(err, res) {
  if (err) {
    console.log('err: ', err);
    return;
  }

  console.log(res):
}

indico.batchSentiment(['Worst movie ever.', 'Best movie ever.'], fn)
// [ 0.07808824238341827, 0.813400530597089 ]
```


Private cloud API Access
------------------------

If you're looking to use indico's API for high throughput applications, email contact@indico.io and ask about our private cloud option.

```javascript
indico.sentiment("Text to analyze", {'api_key': '*********', 'cloud':'example'})
```

The `cloud` parameter redirects API calls to your private cloud hosted at `[cloud].indico.domains` 

Private cloud subdomains can also be set as the environment variable `$INDICO_CLOUD` or as `cloud` in the indicorc file.

Configuration
------------------------

IndicoIo-node will search ./.indicorc and $HOME/.indicorc for the optional configuration file. Values in the local configuration file (./.indicorc) take precedence over those found in a global configuration file ($HOME/.indicorc). The indicorc file can be used to set an authentication username and password or a private cloud subdomain, so these arguments don't need to be specified for every API call. All sections are optional.

Here is an example of a valid indicorc file:


```
[auth]
api_key = example-api-key

[private_cloud]
cloud = example
```

Environment variables take precedence over any configuration found in the indicorc file.
The following environment variables are valid:

```
$INDICO_API_KEY
$INDICO_CLOUD
```

 Finally, any values explicitly passed in to an API call will override configuration options set in the indicorc file or in an environment variable.

### License

See the `LICENSE.md` file.
