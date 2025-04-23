const axios = require('axios');

export default async function handler(req, res) {
    const targetUrl = req.query.url;
    const userAgent = req.headers['user-agent'];
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    let location = {};
    try {
        const response = await axios.get(`https://ipapi.co/${ip}/json/`);
        location = {
            ip,
            city: response.data.city,
            region: response.data.region,
            country: response.data.country_name,
            latitude: response.data.latitude,
            longitude: response.data.longitude
        };
    } catch (e) {
        location = { ip, error: 'Cannot fetch location' };
    }

    console.log({
        timestamp: new Date(),
        userAgent,
        ...location
    });

    // Tạm thời không lưu, chỉ log ra server
    res.writeHead(302, { Location: targetUrl });
    res.end();
}
