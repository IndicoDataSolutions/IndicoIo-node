# indico.io

A node.js wrapper for the [indico API](http://indico.io).

### Installation

Install with [npm](http://npmjs.org/)

```
npm install indico.io
```

API Keys + Setup
----------------
For API key registration and setup, checkout our [quickstart guide](https://indico.io/docs#quickstart).

### Supported APIs

#### Text
- Sentiment Analysis
- Text Tagging
- Political Analysis
- Language Detection
- Keyword Detection
- Twitter Virality
- Intersectional Analysis
- Multi-API Analysis

#### Image
- Facial Emotion Recognition
- Image Feature Extraction
- Facial Feature Extraction
- Face Localization
- Content Filtering
- Image Recognition
- Multi-API Analysis

#### Custom Collections
- Train on your own data and make customized predictions

Full Documentation
------------
Detailed documentation and further code examples are available at [indico.reame.io](https://indico.io/docs).


### Examples

```javascript
var indico = require('indico.io');

// Be sure to set your API key
indico.apiKey = "YOUR_API_KEY";

// Calls to the API return promises

indico
  .political('Guns don\'t kill people. People kill people.')
  .then(function(res){
    console.log(res); // { Libertarian: 0.47740164630834825, Liberal: 0.16617097211030055, Green: 0.08454409540443657, Conservative: 0.2718832861769146}
  })
  .catch(function(err){
    console.log('err: ', err);
  })
  .then(indico.sentiment)

indico
  .sentiment('Worst movie ever.')
  .then(function(){
      console.log(res); // {Sentiment: 0.07062467665597527}
    })
    .catch(function(err){
      console.log('err: ', err);
    })

indico
  .sentiment('Really enjoyed the movie.')
    .then(function(){
      console.log(res); // {Sentiment: 0.8105182526856075}
    })
    .catch(function(err){
      console.log('err: ', err);
    })


indico
  .language('Quis custodiet ipsos custodes')
  .then(function(){
    console.log(res); // {u'Swedish': 0.00033330636691921914, u'Lithuanian': 0.007328693814717631, u'Vietnamese': 0.0002686116137658802, u'Romanian': 8.133913804076592e-06, u'Dutch': 0.09380619821813883, u'Korean': 0.00272046505489883, u'Danish': 0.0012556466207667206, u'Indonesian': 6.623391878530033e-07, u'Latin': 0.8230599921384231, u'Hungarian': 0.0012793617391960567, u'Persian (Farsi)': 0.0019848504383980473, u'Turkish': 0.0004606965429738638, u'French': 0.00016792646226101638, u'Norwegian': 0.0009179030069742254, u'Russian': 0.0002643396088456642, u'Thai': 7.746466749651003e-05, u'Finnish': 0.0026367338676522643, u'Spanish': 0.011844579596827902, u'Bulgarian': 3.746416283126873e-05, u'Greek': 0.027456554742563633, u'Tagalog': 0.0005143018200605518, u'English': 0.00013517846159760138, u'Esperanto': 0.0002599482830232367, u'Italian': 2.650711180999111e-06, u'Portuguese': 0.013193681336032896, u'Chinese': 0.008818957727120736, u'German': 0.00011732494215411359, u'Japanese': 0.0005885208894664065, u'Czech': 9.916434007248934e-05, u'Slovak': 8.869445598583308e-05, u'Hebrew': 3.70933525938127e-05, u'Polish': 9.900290296255447e-05, u'Arabic': 0.00013589586110619373}
  .texttags("This coconut green tea is amazing."); // {u'food': 0.3713687833244494, u'cars': 0.0037924017632370586, ...}
  })
  .catch(function(err){
    console.log('err: ', err);
  })


/*
  testImage is a b64 encoded image (PNG or JPG)
*/

indico
  .imageFeatures(testImage)
  .then(function(){
    console.log(res); // [0.0, -0.02568680526917187, ... , 3.0342637531932777]
  })
  .catch(function(err){
    console.log('err: ', err);
  })

indico
  .fer(testImage)
  .then(function(){
    console.log(res); // {Angry: 0.08843749137458341, Sad: 0.39091163159204684, Neutral: 0.1947947999669361, Surprise: 0.03443785859010413, Fear: 0.17574534848440568, Happy: 0.11567286999192382}
  })
  .catch(function(err){
    console.log('err: ', err);
  });

```

###Batch

Batch requests allow you to process larger volumes of data more efficiently by grouping many examples into a single request.  Simply call the batch method that corresponds to the API you'd like to use, and ensure your data is wrapped in an array.

```javascript
var indico = require('indico.io')

indico
  .batchSentiment(['Worst movie ever.', 'Best movie ever.'])
  .then(function(res){
    console.log(res) // [ 0.07808824238341827, 0.813400530597089 ]
  })
  .catch(function(err){
    console.log('err: ', err);
  })

```
