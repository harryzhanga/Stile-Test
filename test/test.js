var should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest'),
    api = supertest('http://localhost:3000');

describe('test_api', function () {
    this.timeout(15000);
    const str1 =  `<?xml version="1.0" encoding="UTF-8" ?>
        <mcq-test-results>
        <mcq-test-result scanned-on="2017-12-04T13:51:10+11:00">
        <first-name>Jean</first-name>
        <last-name>Stephanie</last-name>
        <student-number>2398</student-number>
        <test-id>9863</test-id>
        <answer question="0" marks-available="1" marks-awarded="0">D</answer>
        <answer question="1" marks-available="1" marks-awarded="1">D</answer>
        <answer question="2" marks-available="1" marks-awarded="1">C</answer>
        <answer question="3" marks-available="1" marks-awarded="0">A</answer>
        <answer question="4" marks-available="1" marks-awarded="1">D</answer>
        <answer question="5" marks-available="1" marks-awarded="0">A</answer>
        <answer question="6" marks-available="1" marks-awarded="0">D</answer>
        <answer question="7" marks-available="1" marks-awarded="0">C</answer>
        <answer question="8" marks-available="1" marks-awarded="0">B</answer>
        <answer question="9" marks-available="1" marks-awarded="1">B</answer>
        <answer question="10" marks-available="1" marks-awarded="0">B</answer>
        <answer question="11" marks-available="1" marks-awarded="0">D</answer>
        <answer question="12" marks-available="1" marks-awarded="0">A</answer>
        <answer question="13" marks-available="1" marks-awarded="1">C</answer>
        <answer question="14" marks-available="1" marks-awarded="0">D</answer>
        <answer question="15" marks-available="1" marks-awarded="1">C</answer>
        <answer question="16" marks-available="1" marks-awarded="0">C</answer>
        <answer question="17" marks-available="1" marks-awarded="0">C</answer>
        <answer question="18" marks-available="1" marks-awarded="1">B</answer>
        <answer question="19" marks-available="1" marks-awarded="1">C</answer>
        <summary-marks available="20" obtained="8" />
        </mcq-test-result>
        </mcq-test-results>
        `;

    const res_1 = {
        count : 1,
        mean: 8,
        p25: 40,
        p50:40,
        p75: 40
    }

    const str2 =  `<?xml version="1.0" encoding="UTF-8" ?>
            <mcq-test-results>
            <mcq-test-result scanned-on="2017-12-04T13:51:10+11:00">
            <first-name>Jean</first-name>
            <last-name>Stephanie</last-name>
            <student-number>2398</student-number>
            <test-id>9863</test-id>
            <answer question="0" marks-available="1" marks-awarded="0">D</answer>
            <answer question="1" marks-available="1" marks-awarded="1">D</answer>
            <answer question="2" marks-available="1" marks-awarded="1">C</answer>
            <answer question="3" marks-available="1" marks-awarded="0">A</answer>
            <answer question="4" marks-available="1" marks-awarded="1">D</answer>
            <answer question="5" marks-available="1" marks-awarded="0">A</answer>
            <answer question="6" marks-available="1" marks-awarded="0">D</answer>
            <answer question="7" marks-available="1" marks-awarded="0">C</answer>
            <answer question="8" marks-available="1" marks-awarded="0">B</answer>
            <answer question="9" marks-available="1" marks-awarded="1">B</answer>
            <answer question="10" marks-available="1" marks-awarded="0">B</answer>
            <answer question="11" marks-available="1" marks-awarded="0">D</answer>
            <answer question="12" marks-available="1" marks-awarded="0">A</answer>
            <answer question="13" marks-available="1" marks-awarded="1">C</answer>
            <answer question="14" marks-available="1" marks-awarded="0">D</answer>
            <answer question="15" marks-available="1" marks-awarded="1">C</answer>
            <answer question="16" marks-available="1" marks-awarded="0">C</answer>
            <answer question="17" marks-available="1" marks-awarded="0">C</answer>
            <answer question="18" marks-available="1" marks-awarded="1">B</answer>
            <answer question="19" marks-available="1" marks-awarded="1">C</answer>
            <summary-marks available="20" obtained="20" />
            </mcq-test-result>
            <mcq-test-result scanned-on="2017-12-04T13:51:10+11:00">
            <first-name>Jean</first-name>
            <last-name>Stephanie</last-name>
            <student-number>8</student-number>
            <test-id>9863</test-id>
            <answer question="0" marks-available="1" marks-awarded="0">D</answer>
            <answer question="1" marks-available="1" marks-awarded="1">D</answer>
            <answer question="2" marks-available="1" marks-awarded="1">C</answer>
            <answer question="3" marks-available="1" marks-awarded="0">A</answer>
            <answer question="4" marks-available="1" marks-awarded="1">D</answer>
            <answer question="5" marks-available="1" marks-awarded="0">A</answer>
            <answer question="6" marks-available="1" marks-awarded="0">D</answer>
            <answer question="7" marks-available="1" marks-awarded="0">C</answer>
            <answer question="8" marks-available="1" marks-awarded="0">B</answer>
            <answer question="9" marks-available="1" marks-awarded="1">B</answer>
            <answer question="10" marks-available="1" marks-awarded="0">B</answer>
            <answer question="11" marks-available="1" marks-awarded="0">D</answer>
            <answer question="12" marks-available="1" marks-awarded="0">A</answer>
            <answer question="13" marks-available="1" marks-awarded="1">C</answer>
            <answer question="14" marks-available="1" marks-awarded="0">D</answer>
            <answer question="15" marks-available="1" marks-awarded="1">C</answer>
            <answer question="16" marks-available="1" marks-awarded="0">C</answer>
            <answer question="17" marks-available="1" marks-awarded="0">C</answer>
            <answer question="18" marks-available="1" marks-awarded="1">B</answer>
            <answer question="19" marks-available="1" marks-awarded="1">C</answer>
            <summary-marks available="20" obtained="20" />
            </mcq-test-result>
            </mcq-test-results>
            `;

    const res_2 = {
        count : 2,
        mean: 20,
        p25: 100,
        p50:100,
        p75: 100
    }

    beforeEach(function (done) {
      setTimeout(function(){
        done();
    }, 5000);
    });

    it("should delete the database", function(done){
        api.get('/delete_database')
            .end(function(error, res) {
                done();
            });
    });

    it('should have updated the database with one test outcome', function(done){
        api.post('/import')
            .set('content-type', 'text/xml+markr')
            .send(str1)
            .expect(200)
            .end(function(error, response, body) {
                if (error) {
                    done(error);
                } else {
                    done();
                }
            });
    });

    it('should return information about the record we just imported', function(done){
        api.get('/results/9863/aggregate')
            .end(function(error, res) {
                expect(res.body).to.deep.equal(res_1);
                done();
            });
    });

    it('should have updated the database with 2 more outcomes', function(done){
        api.post('/import')
            .set('content-type', 'text/xml+markr')
            .send(str2)
            .expect(200)
            .end(function(error, response, body) {
                if (error) {
                    done(error);
                } else {
                    done();
                }
            });
    });

    it('should return information about the test_id with only 2 outcomes', function(done){
        api.get('/results/9863/aggregate')
            .end(function(error, res) {
                expect(res.body).to.deep.equal(res_2);
                done();
            });
    });

    it('should return information about the record we just imported', function(done){
        api.get('/results/3/aggregate')
            .end(function(error, res) {
                expect(res.body).to.deep.equal({count:0});
                done();
            });
    });
});
