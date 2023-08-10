const axios = require('axios');
const cheerio = require('cheerio');
const { parseString } = require('xml2js');

async function crawl(url, baseUrl, visitedPages, discoveredUrls) {
    if (visitedPages.has(url)) {
        return;
    }

    visitedPages.add(url);

    try {
        const response = await axios.get(url);
        const contentType = response.headers['content-type'];

        if (contentType.includes('text/html')) {
            const $ = cheerio.load(response.data);

            $('a').each((index, element) => {
                const link = $(element).attr('href');
                if (link && !visitedPages.has(link) && link.startsWith(baseUrl)) {
                    discoveredUrls.push(link);
                    crawl(link, baseUrl, visitedPages, discoveredUrls);
                }
            });
        }
    } catch (error) {
    }
}

async function parseSitemap(xmlData) {
    return new Promise((resolve, reject) => {
        parseString(xmlData, (err, result) => {
            if (err) {
                reject(err);
            } else {
                const urls = [];
                if (result.urlset && result.urlset.url) {
                    for (const url of result.urlset.url) {
                        urls.push(url.loc[0]);
                    }
                }
                resolve(urls);
            }
        });
    });
}

async function discoverUrls(baseUrl, discoveredUrls) {
    const sitemapUrl = `${baseUrl}/sitemap.xml`;

    try {
        const sitemapResponse = await axios.get(sitemapUrl);
        const sitemapContentType = sitemapResponse.headers['content-type'];

        if (sitemapContentType.includes('application/xml') || sitemapContentType.includes('text/xml')) {
            const sitemapUrls = await parseSitemap(sitemapResponse.data);
            for (const sitemapUrl of sitemapUrls) {
                if (!discoveredUrls.includes(sitemapUrl) && sitemapUrl.startsWith(baseUrl)) {
                    discoveredUrls.push(sitemapUrl);
                    crawl(sitemapUrl, baseUrl, new Set(), discoveredUrls);
                }
            }
        }
    } catch (error) {
        discoveredUrls.push(baseUrl);
        crawl(baseUrl, baseUrl, new Set(), discoveredUrls);
    }
}

async function startCrawling(baseUrl) {
    const discoveredUrls = [];
    await discoverUrls(baseUrl, discoveredUrls);
    return discoveredUrls;
}

module.exports = {
    crawl,
    parseSitemap,
    discoverUrls,
    startCrawling
};