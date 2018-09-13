//importing modules from the directory
const process = require('./process_and_store');
const fetch = require('./fetch');
const log = require('simple-node-logger').createSimpleLogger('project.log');
var bodyParser = require('body-parser');;
require('body-parser-xml')(bodyParser);




//importing express
var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app);

app.use(bodyParser.xml({
    type: "*/*",
    limit: '10mb',
    extended: true
}));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.urlencoded({ extended: false }));



//handle posting of the xml file
app.post('/import', async function(req, res, next) {
    const content_type = req.headers['content-type'];
    log.info('POST request received of type ', content_type);
    if(content_type !== "text/xml+markr"){
        log.error("Wrong type of content-type");
        res.status(400);
        res.send("Issue with document fields");
    }


    let file = req.body["mcq-test-results"];

    let processed_file = process.clean_xml_tests(file);
    if(processed_file){
        const finished_updating = await process.update_database(processed_file);
        //successful acceptance of the document
        res.sendStatus(200);
        log.info('Request processing');
    } else{
        log.error('Issue with given XML file, dismissing request');
        res.status(400);
        res.send("Issue with document fields");
    }
});


//reading from the database and returning the json
app.get('/results/:test_id/aggregate', async (req, res) => {
    let test_id = parseInt(req.params.test_id);
    log.info('GET request received for aggregate information, test_id = ', test_id);
    fetch.send_test_info(test_id, res);
});

//deletes the database for testing purpsoes
app.get('/delete_database', (req, res)=>{
    log.info("DELETING DATABASE");
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb+srv://harry:harry@cluster0-rxnck.mongodb.net/test?retryWrites=true';
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        const collection = client.db("stile").collection("tests");
        collection.drop(function(err, delOK) {
          if (delOK) log.info("Collection deleted");
        });
    });
    res.json({Database:"Deleted"});
});


app.listen(3000);
