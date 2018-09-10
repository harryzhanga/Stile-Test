

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
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb+srv://harry:harry@cluster0-rxnck.mongodb.net/test?retryWrites=true';
    MongoClient.connect(url, function(err, client){
        const collection = client.db("stile").collection("tests");
        for(const test of tests){
            if (err) throw err;


            //check if this student and test has been seen
            var query = {"test-id" : test["test-id"], "student-number": test["student-number"]};
            const found = collection.find(query);
            if(!found){
                collection.insertOne(test);
            }
            else{
                collection.updateOne({
                    "test-id": test["test-id"],
                    "student-number":test["student-number"]
                }, {
                    $set: {
                        "obtained": Math.max(test["obtained"], "obtained")
                    }
                });
            }
        };
        

        client.close();
    });
};
