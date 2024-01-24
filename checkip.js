const { request } = require("http");
var Agent = require("socks5-https-client/lib/Agent");

request(
  {
    url: "http://checkip.amazonaws.com/",
    strictSSL: true,
    agentClass: Agent,
    agentOptions: {
      // socksHost: "localhost", // Defaults to 'localhost'.
      socksPort: 9050, // Defaults to 1080.
    },
  },
  function (err, res) {
    if (err) console.log(err, "error");
    console.log(res.body);
  }
);
