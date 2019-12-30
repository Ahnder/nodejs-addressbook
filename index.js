const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

var app = express();

// DB setting
// mongoose.set = 몽고DB 기본 설정
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// nodejs에서 기본으로 제공되는 process.env 오브젝트는 환경변수들을 가지고 있는 객체다.
// 미리 DB connection string 을 "MONGO_DB"라는 이름의 환경변수에 저장했기 때문에
// nodejs 코드 상에서 process.env.MONGO_DB로 해당 값을 불러올 수 있다.
// mongoose.connect('CONNECTION_STRING') 함수를 사용해서 DB를 연결할 수 있다.
mongoose.connect(process.env.MONGO_DB);
// mongoose의 db object 를 가져와 db변수에 넣는 코드, 
// 이 db 변수에는 DB와 관련된 이벤트 리스너 함수들이 있다.
var db = mongoose.connection;

// db가 성공적으로 연결된 경우 "DB connected"를 출력한다
db.once('open', () => {
    console.log("DB connected");
});
// db 연결 중 에러가 있는 경우 "DB ERROR: "와 에러를 출력한다
db.on('error', err => {
    console.log("DB ERROR: ", err);
});
// ** 1. DB연결은 앱이 실행되면 단 한번만 일어나는 이벤트이다
//       그래서 db.once('이벤트이름', 콜백함수)를 사용하고,
//    2. error는 DB 접속 시 뿐만 아니라, 다양한 경우에 발생할 수 있기 때문에
//       db.on('이벤트이름', 콜백함수)를 사용한다.


// Other setting
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
// json 형식의 데이터를 받는다
// 이 설정을 하면, route의 callback함수의 req.body에서 form으로 입력받은 데이터를 사용할 수 있다.
app.use(bodyParser.json());
// urlencoded data 를 extended 알고리즘을 사용해서 분석한다
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.Schema 함수로 DB에서 사용할 schema를 설정한다.
// 데이터베이스에 정보를 어떠한 형식으로 저장할지를 지정해주는 부분
// contact 라는 형태의 데이터를 DB에 저장할때, 이 contact는 name, email, phone의 항목들을 가지고 있으며
// 세 항목 모두 String타입으로 설정된다. 
// name은 반드시 입력되어야 하며(required:true), 값이 중복되면 안된다(unique:true)는 조건을 설정하였다
var contactSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
});
// mongoose.model 함수를 사용하여 contact schema의 model을 생성한다.
// mogoose.model 함수의 첫 번쨰 parameter는 mongoDB에서 사용되는 컬렉션의 이름이고,
// 두 번째 parameter는 mongoose.Schema로 생성된 오브젝트다.
// DB에 있는 contact라는 데이터 컬렉션을 현재 코드의 Contact라는 변수에 연결해주는 역할을 하는 코드
var Contact = mongoose.model('contact', contactSchema);

// Routes
// Home
app.get('/', (req, res) => {
    res.redirect('/contacts');
});
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
app.get('/contacts', (req, res) => {
    Contact.find({}, (err, contacts) => {
        if (err) return res.json(err);
        res.render('contacts/index', {contacts:contacts});
    });
});
// Contacts - New
app.get('/contacts/new', (req, res) => {
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
app.post('/contacts', (req, res) => {
    Contact.create(req.body, (err, contact) => {
        if (err) return res.json(err);
        res.redirect('/contacts');
    });
});

// Port setting
let port = 3000;
app.listen(port, () => {
    console.log("Server On! http://localhost:" + port);
});