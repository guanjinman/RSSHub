const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const url = 'https://www.backchina.com/news/hot/';
    const response = await got(url, {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
        },
    });

    const $ = cheerio.load(response.data);

    const items = $('.list-item')
        .slice(0, 20)
        .map((_, el) => {
            const element = $(el);
            const title = element.find('a.title').text().trim();
            const link = new URL(element.find('a.title').attr('href'), url).href;
            const pubDate = element.find('span.time').text().trim();
            const description = element.find('.summary').text().trim();
            return {
                title,
                link,
                description,
                pubDate,
            };
        })
        .get();

    ctx.state.data = {
        title: '倍可亲 - 热点新闻',
        link: url,
        item: items,
    };
};
