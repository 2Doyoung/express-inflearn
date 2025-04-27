// 필수 모듈 불러오기
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');

const app = express();

// 라우터 파일 불러오기
const indexRouter = require('./routes');
const userRouter = require('./routes/user');

// 포트 설정 (환경변수에 PORT가 있으면 사용하고 없으면 3000 사용)
app.set('port', process.env.PORT || 3000);

// HTTP 요청 로그를 기록 (개발 모드)
app.use(morgan('dev'));
// app.use(morgan('combined')); // 서버 접속 정보를 자세하게 로그로 남김

// 정적 파일 제공 (public 폴더 내 파일 제공하려는 의도였으나 주석 처리됨)
// app.use('/', express.static(__dirname, 'public'));

// 쿠키 파싱 미들웨어 (서명 없는 쿠키 파싱)
app.use(cookieParser('LEE'));

// 서명된 쿠키 파싱 (환경변수에 저장된 SECRET 사용)
app.use(cookieParser(process.env.COOKIE_SECRET));

// 세션 미들웨어 설정
app.use(session({
    resave: false, // 요청이 들어올 때 세션 데이터가 수정되지 않으면 저장하지 않음
    saveUninitialized: false, // 세션에 저장할 내용이 없더라도 세션을 생성하지 않음
    secret: 'LEE', // 세션 암호화에 사용할 비밀 키
    cookie: {
        httpOnly: true, // 클라이언트가 자바스크립트로 쿠키를 볼 수 없음
    },
    name: 'connect.sid' // 세션 쿠키 이름
}));

// JSON 형식의 요청 바디를 파싱
app.use(express.json());

// URL-encoded 형식의 요청 바디를 파싱 (폼 전송 데이터)
app.use(express.urlencoded({ extended: true }));

// 로그인한 사용자만 static 파일 제공 (세션 ID 존재 여부로 판단)
app.use('/', (req, res, next) => { 
    if (req.session.id) {
        express.static(__dirname, 'public')(req, res, next);
    } else {
        next();
    }
});

// 미들웨어 체인: 모든 요청에서 순서대로 실행
app.use(
    (req, res, next) => {
        console.log('모든 코드1에서 실행');
        next();
    },
    (req, res, next) => {
        console.log('모든 코드2에서 실행');
        next();
    },
    (req, res, next) => {
        console.log('모든 코드3에서 실행');
        next();
    },
    (req, res, next) => {
        try {
            // console.log(notdefined); // 예외를 일부러 발생시키는 코드 (주석 처리됨)
        } catch (error) {
            next(error); // 에러가 발생하면 다음 에러처리 미들웨어로 이동
        }
        next();
    }
);

// multer 설정 (파일 업로드 미들웨어)
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/'); // 업로드 파일 저장 경로
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname); // 파일 확장자 추출
            done(null, path.basename(file.originalname, ext) + Date.now() + ext); // 파일명+시간 조합
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 파일 최대 사이즈: 5MB
});

// 파일 업로드 라우터
app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file); // 업로드된 단일 파일 정보 출력
});

// 같은 URL에 중복 정의가 되어 있음 → 나중에 선언된 핸들러로 덮어씌워짐
app.post('/upload', upload.array('image'), (req, res) => {
    console.log(req.files); // 업로드된 다수 파일 정보 출력
});

// 또 같은 URL에 다른 방식으로 정의됨 → 실제 실행되는 것은 이 마지막 핸들러
app.post('/upload', upload.fields([{ name: 'image1'}, {name: 'image2'}, {name: 'image3'}]), (req, res) => {
    console.log(req.files.image1); // 'image1' 필드로 올라온 파일들
    console.log(req.files.image2); // 'image2' 필드로 올라온 파일들
    console.log(req.files.image3); // 'image3' 필드로 올라온 파일들
});

// 메인 페이지 요청
app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html')); // index.html 파일 전송
    // 세션 및 쿠키 관련 코드 주석 처리됨
}, (req, res, next) => {
    console.log('실행안됨'); // 첫 번째 핸들러에서 응답을 끝냈기 때문에 여기 도달하지 않음
});

// about 페이지 요청
app.get('/about', (req, res) => {    
    res.sendFile(path.join(__dirname, 'about.html'));
});

// 특정 카테고리 - javascript
app.get('/category/javascript', (req, res) => {
    res.send('Hello Javascript');
});

// 동적 라우팅 (ex: /category/java, /category/node 등)
app.get('/category/:name', (req, res) => {
    res.send(`Hello ${req.params.name}`);
});

// POST 요청
app.post('/', (req, res) => {
    res.send('Express Post');
});

// 기본 라우터 등록
app.use('/', indexRouter); // 기본 경로에 indexRouter 연결
app.use('/user', userRouter); // '/user' 경로에 userRouter 연결

// 404 처리 미들웨어 (위 라우터에 걸리지 않은 요청 처리)
app.use((req, res, next) => {
    res.send('404 에러');
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
    console.error(err); // 에러 로그 출력
    res.send('에러페이지');
});

// 서버 실행
app.listen(app.get('port'), () => {
    console.log('Express Server Start');
});
