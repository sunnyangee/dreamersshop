const jwt = require('jsonwebtoken');

exports.handler = async function(event, context) {
    // ✅ Netlify 환경 변수에서 서비스 계정 정보 가져오기
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'); // 🔥 개행 문자 처리

    if (!clientEmail || !privateKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "환경 변수가 설정되지 않았습니다." })
        };
    }

    try {
        const payload = {
            iss: clientEmail,
            scope: "https://www.googleapis.com/auth/spreadsheets",
            aud: "https://oauth2.googleapis.com/token",
            exp: Math.floor(Date.now() / 1000) + 3600, // 1시간 후 만료
            iat: Math.floor(Date.now() / 1000)
        };

        const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ token: token, exp: payload.exp })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "JWT 생성 실패", details: error.toString() })
        };
    }
};
