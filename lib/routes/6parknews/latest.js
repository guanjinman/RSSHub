const cache = require('./cache');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const url = 'https://www.6parknews.com/newspark/index.php';
    const key = '6parknews';

    const data = await cache.get(key);
    if (data) {
        ctx.set('data', data);
        return;
    }

    const response = await ctx.request.get(url);
    const $ = cheerio.load(response.data);

    const items = $('ul.news-list li a')
        .map((_, el) => {
            const title = $(el).text().trim();
            const link = new URL($(el).attr('href'), url).href;

            return {
                title,
                link,
                description: title, // 简单地复用标题作为描述（你可以进一步爬取详情页补充）
                pubDate: new Date(), // 没有时间信息，设置为当前时间或略作调整
            };
        })
        .get();

    const rssData = {
        title: '留园网新闻速递',
        link: url,
        item: items,
    };

    await cache.set(key, rssData);
    ctx.set('data', rssData);
};
