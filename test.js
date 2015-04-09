var indico = require('indico.io');

indico.apiKey = "55e349b12e73e4e706d701920d326980";
indico.sentiment('data', function(err, res) {
    if (err) {
      console.log(err); 
    } 
    
    console.log(res);
});
