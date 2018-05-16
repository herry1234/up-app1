const axios = require("axios");
const cheerio = require('cheerio');
const buffstreamzStreamer = require('./getBuffstreamz');
async function run() {
    const response = await axios.get('https://www.reddit.com/r/nbastreams/');
    const $ = cheerio.load(response.data);
    const GAME_THREAD_SELECTOR = '#ID > div:nth-child(2) > div:nth-child(2) > span:nth-child(1) > a:nth-child(1) > div:nth-child(2) > span:nth-child(1)';
    const GAME_THREAD_LINK = '#ID > div:nth-child(2) > div:nth-child(2) > span:nth-child(1) > a:nth-child(1)'
    let id_list = []
    $('.scrollerItem').each(function (i, el) {
        id_list.push($(this).attr('id'));
    })
    console.log('total topics#', id_list.length);
    let id_link_list = [];
    for (let i = 0; i < id_list.length; i++) {
        console.log(id_list[i]);
        if(id_list[i].length > 40) continue;
        let game_thread_s = GAME_THREAD_SELECTOR.replace('ID', id_list[i]);
        let game_thread_link_s = GAME_THREAD_LINK.replace('ID', id_list[i]);
        let is_game_thread = $(game_thread_s).text() === "Game Thread"

        if (is_game_thread) {
            const myurl = $(game_thread_link_s).attr('href');
            console.log(myurl);
            const current_id = id_list[i].replace('thing', '');
            console.log(current_id);
            id_link_list.push({ id: current_id, url: myurl });
        }
    }

    const results = id_link_list.map(async (item) => {
        console.log("going to ", item.url);
        let myUrl = item.url.match('^http') ? item.url : 'https://www.reddit.com' + item.url
        const response = await axios.get(myUrl);
        const $ = cheerio.load(response.data);
        let URL_TABLE_SELECTOR = 'table>tbody>tr>td>a';
        const urllist = $(URL_TABLE_SELECTOR);
        const streamer_links = urllist.map(function (i, el) {
            return $(this).attr('href')
        }).get();
        console.log("links : ", streamer_links);
        const result = streamer_links.filter((el) => el.match('buffstreamz') != null).map(async (element) => {
            return await buffstreamzStreamer.getStream(element);
        });
        return await Promise.all(result);
    });
    const res_str = await Promise.all(results);
    console.log("WW", res_str.join());
    return res_str.join();
}
exports.showlinks = run;
// run().catch(console.error.bind(console))
