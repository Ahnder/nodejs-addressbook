const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

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
// _method 의 query 로 들어오는 값으로 HTTP method를 바꾼다
// ex) http://example.com/category/id?_method=delete 를 받으면 _method 값인 delete 를 읽어
//     해당 request 의 HTTP method 를 delete 로 바꾼다
app.use(methodOverride('_method'));

// Routes
app.use('/', require('./routes/home'));
app.use('/contacts', require('./routes/contacts'));

// Port setting
let port = 3000;
app.listen(port, () => {
    console.log("Server On! http://localhost:" + port);
});