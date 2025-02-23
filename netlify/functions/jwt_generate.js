const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
    try {
        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
        let privateKey = process.env.GOOGLE_PRIVATE_KEY;

        if (!clientEmail || !privateKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "환경 변수가 설정되지 않았습니다." }),
            };
        }

        // 🔥 privateKey의 \n 개행 문자를 정상적인 줄바꿈으로 변환
        privateKey = privateKey.replace(/\\n/g, '\n');

        const payload = {
            iss: clientEmail,
            scope: "https://www.googleapis.com/auth/spreadsheets",
            aud: "https://oauth2.googleapis.com/token",
            exp: Math.floor(Date.now() / 1000) + 3600, // 1시간 후 만료
            iat: Math.floor(Date.now() / 1000),
        };

        const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
