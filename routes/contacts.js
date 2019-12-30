const express = require('express');

let router = express.Router();
let Contact = require('../models/Contact');

// Contacts - Index
// Contact.find({}, callback) = 모델.find(검색조건, callback)
// - 모델.find 함수는 DB에서 검색조건에 맞는 모델(이 코드에서는 Contact) data를 찾고
//   콜백함수를 호출한다.
// - 모델.find 의 검색조건은 Object형태로 전달되는데, 빈 Object({})를 전달하는 경우(=검색조건없음)
//   DB에서 해당 모듈의 모든 data를 return한다.
// - 모델.find의 callback은 function(에러, 검색결과)의 형태다
//   첫 번째 parameter인 에러는 error가 있는 경우에만 내용이 전달된다. 즉, if(err)로 에러확인이 가능하다
//   두 번째 parameter인 검색결과(이 코드에서는 contacts)는 한개 이상일 수 있기 때문에 검색결과는
//   항상 array이며 심지어 검색 결과가 없는 경우에도 빈 array를 전달한다
//   검색결과가 array임을 내타내기 위해 parameter 이름으로 contact의 복수형인 contacts를 사용했다 
router.get('/', (req, res) => {
    Contact.find({}, (err, contacts) => {
        if (err) return res.json(err);
        res.render('contacts/index', {contacts:contacts});
    });
});
// Contacts - New
router.get('/new', (req, res) => {
    res.render('contacts/new');
});
// Contacts - Create
// 모델.create는 DB에 data를 생성하는 함수다
// 첫 번째 parameter로 생성 할 data의 object(이 코드에서는 req.body)를 받고,
// 두 번째 parameter로 callback함수를 받는다
// 모델.create의 callback함수(function(err, contact){})는 
// 첫 번째 parameter로 error를 받고
// 두 번쨰 parameter로 생성된 data를 받는다
// 생성된 data는 항상 하나이므로 parameter이름으로 단수형인 contact를 사용하였다
// 에러없이 contact data 가 생성되면 /contacts로 redirect 한다
router.post('/', (req, res) => {
    Contact.create(req.body, (err, contact) => {
        if (err) return res.json(err);
        res.redirect('/contacts');
    });
});
// Contacts - Show
// "contacts/:id" 에 get 요청이 오는 경우
// :id 처럼 route 에 콜론(:)을 사용하면 해당 위치의 값을 받아 req.params 에 넣게 된다
// 예를들어 "contacts/asd123" 이 입력되면 "contacts/:id" route 에서 이를 받아 
// req.params.id 에 "asd123" 을 넣게 된다
// Model.findOnd 은 DB에서 해당 model 의 document 를 하나 찾는 함수이다
// 첫 번째 parameter로 찾을 조건을 object로 입력하고 data를 찾은 후 callback함수를 호출한다
// Model.find는 조건에 맞는 결과를 모두 찾아 array로 전달하는데 비해
// Model.findOne은 조건에 맞는 결과를 하나 찾아 object로 전달한다(검색결과가 없다면 null 전달)
// 아래의 코드에서는 {_id:req.params.id}를 조건으로 전달하고 있는데, 
// 즉 DB의 contacts collection 에서 _id가 req.params.id 와 일치하는 data를 찾는 조건이다
// 에러가 없다면 검색 결과를 받아 views/contacts/show.ejs를 render 한다 
router.get('/:id', (req, res) => {
    Contact.findOne({_id:req.params.id}, (err, contact) => {
        if (err) return res.json(err);
        res.render('contacts/show', {contact:contact});
    });
});
// Contacts - Edit
router.get('/:id/edit', (req, res) => {
    Contact.findOne({_id:req.params.id}, (err, contact) => {
        if (err) return res.json(err);
        res.render('contacts/edit', {contact:contact});
    });
});
// Contacts - Update
// Model.findOneAndUpdate 는 DB에서 해당 model 의 document 를 하나 찾아 그 data 를 수정하는 함수다
// 첫 번째 parameter 로 찾을 조건을 object 로 입력하고
// 두 번째 parameter 로 update 할 정보를 object 로 입력, data 를 찾은 후 
// callback함수를 호출한다
// 이때 callback함수로 넘겨지는 값은 수정되기 전의 값이다
// 만약 업데이트된 후의 값을 보고 싶다면 callback함수 전에 parameter로 {new:true}를 넣어주면 된다
router.put('/:id', (req, res) => {
    Contact.findOneAndUpdate({_id:req.params.id}, req.body, (err, contact) => {
        if (err) return res.json(err);
        res.redirect('/contacts/' + req.params.id);
    });
});
// Contacts - destroy
// Model.deleteOne 은 DB 에서 해당 model의 document 를 하나 찾아 삭제하는 함수다
// 첫 번쨰 parameter 로 찾을 조건을 입력하고 data 를 찾은 후 callback함수를 호출한다
router.delete('/:id', (req, res) => {
    Contact.deleteOne({_id:req.params.id}, err => {
        if (err) return res.json(err);
        res.redirect('/contacts');
    });
});


module.exports = router;