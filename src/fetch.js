/////////////////////////////////////////////////////
//  Taken from StackOverflow

var Quartile = function(data, q) {
  data=Array_Sort_Numbers(data);
  var pos = ((data.length) - 1) * q;
  var base = Math.floor(pos);
  var rest = pos - base;
  if( (data[base+1]!==undefined) ) {
    return data[base] + rest * (data[base+1] - data[base]);
  } else {
    return data[base];
  }
}

var Array_Sort_Numbers = function(inputarray){
  return inputarray.sort(function(a, b) {
    return a - b;
  });
}

//////////////////////////////////////////////////////

var getMean = function(scores){
    var sum = 0;
    for( var i = 0; i < scores.length; i++ ){
        sum += scores[i];
    }
    return sum/scores.length;
}

//takes the array of test scores and returns an object of statistics about it
get_statistics = arr => {
    let scores = [];
    let available;
    for(const result of arr){
        scores.push(result["obtained"]);
        available = result["available"];
    }

    //If there are no test scores for this test, then we can't find quantiles etc...
    if(scores.length === 0){
        return{
            "count":0
        }
    }
    return({
        "count":arr.length,
        "mean": getMean(scores),
        "p25": 100*Quartile(scores, 0.25)/available,
        "p50":100*Quartile(scores, 0.5)/available,
        "p75": 100*Quartile(scores, 0.75)/available
    })
}


//Function to take in the test id, calculate the test statistics and send them
exports.send_test_info = (test_id, res) => {
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb+srv://harry:harry@cluster0-rxnck.mongodb.net/test?retryWrites=true';
    MongoClient.connect(url, { useNewUrlParser: true }, async (err, client) => {
        if (err) throw err;
        const collection = client.db("stile").collection("tests");
        const query = {"test-id" : test_id};
        const data = await collection.find(query).toArray();
        res.json(get_statistics(data));
    });
}
