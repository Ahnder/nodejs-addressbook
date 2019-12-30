const mongoose = require('mongoose');

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


module.exports = Contact;