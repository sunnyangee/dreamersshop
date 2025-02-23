const express = require('express');
const cors = require('cors');  // ✅ CORS 라이브러리 추가
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const port = 3000;

// ✅ 모든 도메인에서 접근 가능하도록 CORS 설정
app.use(cors());

const keyFile = require('/Users/jjisun/Desktop/shop/dreamersstats-1547bcd6c6d9.json');

// ✅ 루트 경로 (테스트용)
app.get('/', (req, res) => {
    res.send("✅ JWT 생성 서버가 정상적으로 실행 중입니다! '/generate-jwt' 엔드포인트를 사용하세요.");
});

// ✅ JWT 생성 엔드포인트
app.get('/generate-jwt', (req, res) => {
    const payload = {
        iss: keyFile.client_email,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: "https://oauth2.googleapis.com/token",
        exp: Math.floor(Date.now() / 1000) + 3600, // 1시간 후 만료
        iat: Math.floor(Date.now() / 1000)
    };

    const privateKey = keyFile.private_key.replace(/\\n/g, '\n');
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

    // ✅ CORS 헤더 추가
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.json({ token: token, exp: payload.exp });
});

app.listen(port, () => {
    console.log(`✅ JWT Server running at http://localhost:${port}`);
});
