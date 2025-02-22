const jwt = require('jsonwebtoken');
const fs = require('fs');

// JSON 키 파일을 불러오기 (다운로드한 서비스 계정 키)
const keyFile = require('/Users/jjisun/Downloads/dreamersstats-21b50c4e6836.json');  // 🔥 JSON 키 파일 경로 입력

const payload = {
  iss: keyFile.client_email,
  scope: "https://www.googleapis.com/auth/spreadsheets",
  aud: "https://oauth2.googleapis.com/token",
  exp: Math.floor(Date.now() / 1000) + 3600, // 1시간 후 만료
  iat: Math.floor(Date.now() / 1000)
};

const privateKey = keyFile.private_key.replace(/\\n/g, '\n'); // 🔥 개행 문자 변환

const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

console.log("Generated JWT Token:", token);
