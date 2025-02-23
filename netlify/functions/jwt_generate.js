const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;  // ✅ Netlify가 할당한 포트 사용

app.use(cors());  // ✅ CORS 허용

// ✅ 환경 변수에서 서비스 계정 정보 가져오기
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');  // 🔥 개행 문자 변환

app.get('/', (req, res) => {
    res.send("✅ JWT 생성 서버가 실행 중! '/generate-jwt' 엔드포인트 사용 가능");
});

// ✅ JWT 생성 엔드포인트
app.get('/generate-jwt', (req, res) => {
    if (!clientEmail || !privateKey) {
        return res.status(500).json({ error: "환경 변수가 설정되지 않았습니다." });
    }

    const payload = {
        iss: clientEmail,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: "https://oauth2.googleapis.com/token",
        exp: Math.floor(Date.now() / 1000) + 3600, // 1시간 후 만료
        iat: Math.floor(Date.now() / 1000)
    };

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.json({ token: token, exp: payload.exp });
});

app.listen(port, () => {
    console.log(`✅ JWT Server running on port ${port}`);
});
