const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    try {
        const url = 'https://www.ghxi.com/category/all';
        const response = await got(url);
        const $ = cheerio.load(response.data);

        const items = $('.excerpt')
            .map((_, el) => {
                const element = $(el);
                const title = element.find('h2 a').text().trim();
                const link = element.find('h2 a').attr('href');
                const description = element.find('.note').text().trim();
                const pubDateText = element.find('.time').text().trim();

                let pubDate = new Date();
                if (pubDateText) {
                    pubDate = new Date(pubDateText.replace(/年|月/g, '-').replace('日/, ''));
                    if (isNaN(pubDate.getTime())) {
                        pubDate = new Date();
                    }
                }

                return {
                    title,
                    link,
                    description,
                    pubDate: pubDate.toUTCString(),
                };
            })
            .get();

        ctx.state.data = {
            title: '果核剥壳 - 所有文章',
            link: url,
            item: items,
        };
    } catch (err) {
        console.error('❌ Error in /ghxi/latest:', err);
        throw err;
    }
};
