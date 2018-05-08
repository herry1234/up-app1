const axios = require("axios");
const cheerio = require('cheerio');
async function getScript(bsUrl) {
    try {
        const response = await axios.get(bsUrl);
        // console.log(response.data);
        const $ = cheerio.load(response.data);
        let playerPage = $('div#play > iframe').attr('src');
        console.log(playerPage);
        const response2 = await axios.get(playerPage);
        const $2 = cheerio.load(response2.data);
        // console.log(response2.data);
        let playerUrl = $2('iframe').attr('src');
        if (playerUrl.startsWith('http') 　!= true) {
            playerUrl = 'http://' + playerUrl;
        }
        //playerUrl = "http://riere.club/l21.php?n=n44244";
        console.log(playerUrl);
        const playerResponse = await axios.get(playerUrl, {
            'headers': {
                'content-type': 'text/html; charset=UTF-8',
                'Accept-Encoding': 'gzip, deflate',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
                'Referer': playerPage
            }
        });
        const regex1 = RegExp('source:(.*)\,');
        let paringResult = null;
        if ((paringResult = regex1.exec(playerResponse.data)) != null) {
            console.log(paringResult[1]);
            return paringResult[1].replace(/['"]+/g, '').trim();
        }
    } catch (error) {
        console.error(error);
    }
}
exports.getStream = getScript;
// getScript('http://buffstreamz.com/watch/nba-47.php');
