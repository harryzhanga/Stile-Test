var clean_xml_tests = function(file){
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

var update_database = function(file){
        console.log("Updating database");
};

var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    xmlparser = require('express-xml-bodyparser');


app.use(express.json());
app.use(express.urlencoded());
app.use(xmlparser());

app.post('/import', function(req, res, next) {
    let file = req.body["mcq-test-results"];
    let processed_file = clean_xml_tests(file);
    if(processed_file){
        update_database(file);
    }


    res.send(file);
});


app.get('/results/:test_id/aggregate', (req, res) => {
    let test_id = req.params.test_id;
    console.log(test_id);
    res.json({
        mean: 10,
        count: 10,
        p25: 50,
        p50: 70,
        p75: 80
    });
});

app.listen(3000)
