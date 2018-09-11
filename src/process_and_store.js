exports.clean_xml_tests = function(file){
    //returns false is the xml file is not valid (missing fields)
    //otherwise returns a cleaned version of the tests
    //valid file constraints:
    //each test result has a test-id, student-number, summary-marks with available and obtained
    let cleaned_tests = [];
    for(const result of file["mcq-test-result"]){
        //check if any of the fields are missing
        if(!result["student-number"] || !result["test-id"] || !result["summary-marks"]){
            console.log("ISSUE IN FIRST");
            return false;
        }

        let marks = result["summary-marks"];
        let test_info = marks[0]["$"];

        //also check for fields that should be in the test object
        if(!test_info["available"] || !test_info["obtained"]){
            console.log("ISSUE IN SECOND");
            return false;
        }


        //creaating the cleaned test object
        let new_test = {};
        new_test["student-number"] = parseInt(result["student-number"][0], 10);
        new_test["test-id"] = parseInt(result["test-id"][0], 10);
        new_test["available"] = parseInt(test_info["available"], 10);
        new_test["obtained"] = parseInt(test_info["obtained"], 10);

        cleaned_tests.push(new_test);
    }
    return cleaned_tests;
};


exports.update_database = function(tests){
    //this function will update the database with the cleaned_tests given by the clean_xml_tests function

    //connecting to the mongodb
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb+srv://harry:harry@cluster0-rxnck.mongodb.net/test?retryWrites=true';
    MongoClient.connect(url, function(err, client){
        const collection = client.db("stile").collection("tests");

        //for each result that is given
        for(const test of tests){
            if (err) throw err;

            //we are checking whether this result has already been seen
            var query = {"test-id" : test["test-id"], "student-number": test["student-number"]};


            collection.find(query).toArray()
                .then(data => {

                    //if has not been seen before then insert
                    if(data.length == 0){
                        collection.insertOne(test);
                    }

                    //if it has been seen then update it
                    else{
                        collection.updateOne({
                            "test-id": test["test-id"],
                            "student-number":test["student-number"]
                        }, {
                            $max: {
                                "obtained": test["obtained"],
                                "available": test["available"]
                            }
                        });
                    }
                });
        };

    });
};
