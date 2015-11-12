module.exports = {
  "models": [
    {
      name: 'intersections',
      type: 'text',
      endpoint: '/apis/intersections'
},
    {
      name: 'twitterEngagement',
      type: 'text',
      endpoint: '/twitterengagement'
},
    {
      name: 'political',
      type: 'text',
      endpoint: '/political'
},
    {
      name: 'sentiment',
      type: 'text',
      endpoint: '/sentiment'
},
    {
      name: 'sentimentHQ',
      type: 'text',
      endpoint: '/sentimenthq'
},
    {
      name: 'language',
      type: 'text',
      endpoint: '/language'
},
    {
      name: 'textTags',
      type: 'text',
      endpoint: '/texttags'
},
    {
      name: 'keywords',
      type: 'text',
      endpoint: '/keywords'
},
    {
      name: 'namedEntities',
      type: 'text',
      endpoint: '/namedentities'
},
    {
      name: 'analyzeText',
      type: 'text',
      endpoint: '/apis/multiapi'
},
    {
      name: 'facialLocalization',
      type: 'image',
      size: false,
      endpoint: '/faciallocalization'
},
    {
      name: 'facialFeatures',
      type: 'image',
      size: 48,
      endpoint: '/facialfeatures'
},
    {
      name: 'fer',
      type: 'image',
      size: 48,
      endpoint: '/fer'
},
    {
      name: 'imageFeatures',
      type: 'image',
      size: 144,
      min_axis: true,
      endpoint: '/imagefeatures'
},
    {
      name: 'imageRecognition',
      type: 'image',
      size: 144,
      min_axis: true,
      endpoint: '/imagerecognition'
},
    {
      name: 'contentFiltering',
      type: 'image',
      size: 128,
      min_axis: true,
      endpoint: '/contentfiltering'
},
    {
      name: 'analyzeImage',
      type: 'image',
      size: 64,
      endpoint: '/apis/multiapi'
}],
  "training": [{
      name: 'addData',
      type: 'training',
      endpoint: '/training/addData'
}, {
      name: 'collections',
      type: 'training',
      endpoint: '/training/colllections'
}, {
      name: 'predict',
      type: 'training',
      endpoint: '/training/predict'
},
    {
      name: 'clearCollection',
      type: 'training',
      endpoint: '/training/clear_collection'
},
    {
      name: 'removeExample',
      type: 'training',
      endpoint: '/training/remove_example'
}]
};
