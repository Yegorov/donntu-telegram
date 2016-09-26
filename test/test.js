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

const News = require('../db/models/index').News;

describe('Use database', function() {
    it('Should add news to table', function() {
        //assert.equal('sdfsdf', 'sdf');
        console.log("test msg")
        News.create({
            id: 1,
            title: "Книжная выставка к 150-летию со дня рождения Герберта Джорджа Уэллса",
            date_created: new Date(2016, 6, 22),
            content_id: "id201609221452",
            text_preview: "Герберт Джордж Уэллс – английский писатель и публицист, родоначальник научно-фантастической литературы XX века. Он был удивительно изобретателен, и каждый мог читать его по-своему. Интерес к книгам Герберта Уэллса, его писательская слава и популярность, актуальны и сейчас. Выбрать своё любимое..."
        }).then(function(create_new) {
            
            console.log(create_new)
            //assert.equal("https://donntu.org/news/id201609221452", create_new.getUrl)
        }, function(err){
            assert.fail(err);
            console.log(err)
        })
        
    })
})