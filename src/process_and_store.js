const log = require('simple-node-logger').createSimpleLogger('project.log');




exports.clean_xml_tests = function(file){
    //returns false is the xml file is not valid (missing fields)
    //otherwise returns a cleaned version of the tests
    //valid file constraints:
    //each test result has a test-id, student-number, summary-marks with available and obtained
    let cleaned_tests = [];
    for(const result of file["mcq-test-result"]){
        //check if any of the fields are missing
        if(!result["student-number"] || !result["test-id"] || !result["summary-marks"]){
            log.error('Issue with test outcome, no student-number, test-id or summary-marks');
            return false;
        }

        let marks = result["summary-marks"];
        let test_info = marks[0]["$"];

        //also check for fields that should be in the test object
        if(!test_info["available"] || !test_info["obtained"]){
            log.error('Issue with test outcome, no available or obtained field');
            return false;
        }

        //creaating the cleaned test object
        let new_test = {};
        new_test["student-number"] = parseInt(result["student-number"][0]);
        new_test["test-id"] = parseInt(result["test-id"][0]);
        new_test["available"] = parseInt(test_info["available"]);
        new_test["obtained"] = parseInt(test_info["obtained"]);

        cleaned_tests.push(new_test);
    }
    return cleaned_tests;
};

add_to_database = async (test, collection) => {
    //we are checking whether this result has already been seen
    var query = {"test-id" : test["test-id"], "student-number": test["student-number"]};
    var test_outcome = await collection.find(query).toArray();
    //unseen test outcome so insert into database
    if(test_outcome.length === 0){
        log.info('Inserting into the database', test);
        collection.insertOne(test);
    }
    //we have have seen it before so update it
    else{
        log.info('Updating the database ', test);
        collection.updateOne({
            "test-id": test["test-id"],
            "student-number":test["student-number"]
        }, {
            $max: {
                //pick the maximum
                "obtained": test["obtained"],
                "available": test["available"]
            }
        });
    }
}


exports.update_database = function(tests){
    //this function will update the database with the cleaned_tests given by the clean_xml_tests function

    //connecting to the mongodb
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb+srv://harry:harry@cluster0-rxnck.mongodb.net/test?retryWrites=true';
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        const collection = client.db("stile").collection("tests");

        //for each result that is given
        for(const test of tests){
            if (err) throw err;

            add_to_database(test, collection);
        };

    });
};
