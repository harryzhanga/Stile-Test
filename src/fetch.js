get_statistics = function(arr){
    console.log(arr);
}


exports.get_test_info = function(test_id){
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb+srv://harry:harry@cluster0-rxnck.mongodb.net/test?retryWrites=true';
    MongoClient.connect(url, function(err, client){
        if (err) throw err;
        const collection = client.db("stile").collection("tests");
        const query = {"test-id" : test_id};

        var results = collection.find(query);
        results.then(data => {
            var result = data.toArray();
            get_statistics(result);
        });

        client.close();
    });
}
