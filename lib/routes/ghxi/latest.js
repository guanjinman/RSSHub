const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const url = 'https://www.ghxi.com/category/all';
    const { data } = await got(url);
    const $ = cheerio.load(data);

    const items = $('article')
        .map((_, el) => {
            const element = $(el);
            const title = element.find('h2 a').text().trim();
            const link = element.find('h2 a').attr('href');
            const description = element.find('.entry_excerpt p').text().trim();
            const pubDateText = element.find('time').attr('datetime'); // ISO 8601
            const pubDate = pubDateText ? new Date(pubDateText).toUTCString() : new Date().toUTCString();

            return {
                title,
                link,
                description,
                pubDate,
            };
        })
        .get();

    ctx.state.data = {
        title: '果核剥壳 - 最新文章',
        link: url,
        item: items,
    };
};
