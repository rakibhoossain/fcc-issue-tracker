/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

// For our functional tests, we'll be using Chai.js's TDD/assertion library.
const chai = require('chai');
const assert = chai.assert;

// We'll also need the Chai-HTTP addon/plugin for Chai.js in order to do integration testing...
const chaiHttp = require('chai-http');
// ... for which we'll define our server location...
const server = require('../server');
// ... and tell Chai.js to use the HTTP plugin:
chai.use(chaiHttp);



suite('Functional Tests', function() {
  
  // To be able to run tests on the PUT and DELETE requests, we'll need some valid IDs.
  // To get some of these, when we run our test POST methods, we'll save the returned IDs here globally, so that we can access them later on:
  
  let id1;
  let id2;
  
  suite('POST /api/issues/{project} => object with issue data', function() {
    
    test('Every field filled in', function(done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'open');
          assert.property(res.body, 'status_text');
          assert.property(res.body, '_id');
        
          // We'll save the ID for this issue globally:
          id1 = res.body._id;
        
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(res.body.created_by, "Functional Test - Every field filled in");
          assert.equal(res.body.assigned_to, "Chai and Mocha");
          assert.equal(res.body.open, true);
          assert.equal(res.body.status_text, "In QA");
          
          done();
        });
      });
      
    
    
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post("/api/issues/test")
          .send({
            issue_title: 'Another test another title',
            issue_text: 'text',
            created_by: 'Functional Test - Required fields filled in'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'issue_title');
            assert.property(res.body, 'issue_text');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on');
            assert.property(res.body, 'created_by');
            assert.property(res.body, 'assigned_to');
            assert.property(res.body, 'open');
            assert.property(res.body, 'status_text');
            assert.property(res.body, '_id');
          
            // We'll also save the ID for this issue globally:
            id2 = res.body._id;
          
            assert.equal(res.body.issue_title, "Another test another title");
            assert.equal(res.body.issue_text, "text");
            assert.equal(res.body.created_by, "Functional Test - Required fields filled in");
            assert.equal(res.body.assigned_to, "");
            assert.equal(res.body.open, true);
            assert.equal(res.body.status_text, "");

            done();        
          });
        });
      
        
        
      test('Missing required fields', function(done) {
        chai.request(server)
          .post("/api/issues/test")
          .send({
            issue_title: "One more test",
            //issue_text: 'text',
            created_by: 'Functional Test - Missing required fields'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "missing required fields");
            
            done();
          });
        });
    
  });  // END of suite('POST /api/issues/{project}
    
  
  
    
  
    
    suite('PUT /api/issues/{project} => text', function(done) {
      
      test('No body', function(done) {
        chai.request(server)
          .put("/api/issues/test")
          .send( {_id: id1} )
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no updated field sent");
        
            done();
          });
        });
    
    
      
      test('One field to update', function(done) {
        chai.request(server)
          .put("/api/issues/test")
          .send({
            _id: id2,
            issue_title: "Updated title"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "successfully updated");
          
            done();          
          });
        });
      
    
    
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put("/api/issues/test")
          .send({
            _id: id2,
            issue_title: "Updated title",
            status_text: "also update the status text"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "successfully updated");
          
            done();          
          });
        });
    
  });  // END of suite('PUT /api/issues/{project}
    
  
  
  
  
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get("/api/issues/test")
        .query({})
        .end(function(err, res){          
          assert.equal(res.status, 200);
          assert.isArray(res.body);                          // Actually a project requirement, so we ought to test for it.
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          
          done();
        });
      });
      
      
      
      test('One filter', function(done) {
        chai.request(server)
          .get("/api/issues/test")
          .query({
            issue_title: "Updated title"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);                          // Actually a project requirement, so we ought to test for it.
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
          
            assert.equal(res.body[0].issue_title, "Updated title");
            
            done();
          });
        });
      
      
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get("/api/issues/test")
          .query({
            issue_title: "Updated title",
            open: "true"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);                          // Actually a project requirement, so we ought to test for it.
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
          
            assert.equal(res.body[0].issue_title, "Updated title");
            assert.equal(res.body[0].open, true);
            
            done();
          });
        });
      
    });  // END of suite('GET /api/issues/{project} 
    
  
  
  
  
    suite('DELETE /api/issues/{project} => text', function(done) {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete("/api/issues/test")
          .send( {} )  //empty
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "_id error");
            
            done();
          });
        });
      
      
      
      test('Valid _id', function(done) {
        chai.request(server)
          .delete("/api/issues/test")
          .send({
            _id: id1
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "deleted " + id1);
            
            done();
          })
      });
      
    });  // END of suite('DELETE /api/issues/{project})

});  // END of suite('Functional Tests',