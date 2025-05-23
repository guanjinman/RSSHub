const got = require('@/utils/got');

module.exports = async (ctx) => {
    const url = 'https://www.ghxi.com/api/getlist';

    const response = await got({
        method: 'get',
        url,
        headers: {
            'User-Agent': 'Mozilla/5.0',
        },
    });

    const data = response.data.list;

    const items = data.map((item) => ({
        title: item.title,
        link: item.url,
        pubDate: new Date(item.post_date).toUTCString(),
        description: item.excerpt || '', // 果核剥壳的摘要字段
    }));

    ctx.state.data = {
        title: '果核剥壳 - 最新文章',
        link: 'https://www.ghxi.com/category/all',
        item: items,
    };
};
