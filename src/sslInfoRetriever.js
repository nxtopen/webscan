const tls = require('tls');
const https = require('https');

function getSSLCertificate(domain, callback) {
  const options = {
    host: domain,
    port: 443,
    rejectUnauthorized: false, // Allow self-signed certificates
  };

  const socket = tls.connect(options, () => {
    const cert = socket.getPeerCertificate();
    socket.end();
    callback(null, cert);
  });

  socket.on('error', (error) => {
    callback(error);
  });
}

function getHTTPSCertificate(domain, callback) {
  const requestOptions = {
    hostname: domain,
    port: 443,
    path: '/',
    method: 'GET',
    rejectUnauthorized: false, // Allow self-signed certificates
  };

  const req = https.request(requestOptions, (res) => {
    const cert = res.socket.getPeerCertificate();
    callback(null, cert);
  });

  req.on('error', (error) => {
    callback(error);
  });

  req.end();
}

module.exports = {
  getSSLCertificate,
  getHTTPSCertificate,
};