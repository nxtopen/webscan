const sslInfoRetriever = require('./sslInfoRetriever');
const { startCrawling } = require('./crawler');

async function webScan(domain) {
    try {
        const sslcertificatePromise = new Promise((resolve, reject) => {
            sslInfoRetriever.getSSLCertificate(domain, (error, cert) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(cert);
                }
            });
        });

        const httpscertificatePromise = new Promise((resolve, reject) => {
            sslInfoRetriever.getHTTPSCertificate(domain, (error, cert) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(cert);
                }
            });
        });

        const pagesPromise = new Promise(async (resolve, reject) => {
            try {
                const discoveredUrls = await startCrawling(`https://${domain}`);
                resolve(discoveredUrls);
            } catch (error) {
                reject(error);
            }
        });

        const [sslcertificateResponse, httpscertificateResponse, pagesResponse] = await Promise.all([
            sslcertificatePromise,
            httpscertificatePromise,
            pagesPromise
        ]);

        return {
            'SSL_CERTIFICATE': sslcertificateResponse,
            'HTTP_CERTIFICATE': httpscertificateResponse,
            'PAGES': pagesResponse,
        };
    } catch (error) {
        throw error;
    }
}

module.exports = webScan;