const cheerio = require('cheerio');
const got = require('@/utils/got');

module.exports = async (ctx) => {
    const url = 'https://www.6parknews.com/newspark/index.php';

    const response = await got(url);
    const $ = cheerio.load(response.data);

    const items = $('ul.news-list li a')
        .map((_, el) => {
            const title = $(el).text().trim();
            const link = new URL($(el).attr('href'), url).href;

            return {
                title,
                link,
                description: title,
                pubDate: new Date(),
            };
        })
        .get();

    ctx.state.data = {
        title: '留园网新闻速递',
        link: url,
        item: items,
    };
};
