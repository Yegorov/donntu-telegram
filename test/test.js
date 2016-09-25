const should = require('should'); 
const assert = require('assert');
const request = require('supertest');

// Run server
const app = require('../app.js');

describe('Some test', function(){
    it('Should return main page', function(){
        request(app)
            .get('/')
            .end(function(err, res){
                if (err)
                    throw err;
                res.shoud.have.status(200);
            })
    })
})