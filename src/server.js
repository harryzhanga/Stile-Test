//importing modules from the directory
const process = require('./process_and_store');
const fetch = require('./fetch');

//importing express
var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    xmlparser = require('express-xml-bodyparser');
app.use(express.json());
app.use(express.urlencoded());
app.use(xmlparser());

//importing mongodb

//handle posting of the xml file
app.post('/import', function(req, res, next) {
    let file = req.body["mcq-test-results"];
    let processed_file = process.clean_xml_tests(file);
    if(processed_file){
        process.update_database(processed_file);
        //successful acceptance of the document
        res.sendStatus(200);
    }
    else{
        res.status(400);
        res.send("Issue with document fields");
    }
});


//reading from the database and returning the json
app.get('/results/:test_id/aggregate', (req, res) => {
    let test_id = req.params.test_id;
    res.json(fetch.get_test_info(test_id));
});

app.listen(3000);
