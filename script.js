const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const ProxyPlugin = require("puppeteer-extra-plugin-proxy");
const { SocksProxyAgent } = require("socks-proxy-agent");
const tr = require("tor-request");

const duration = 1000;
const torProxy = "socks5://localhost:9050";
const sock = "socks5://localhost:9050";

const httpAgent = new SocksProxyAgent(sock);
const httpsAgent = new SocksProxyAgent(sock);

const express = require("express");
const { default: axios } = require("axios");
const app = express();
var shttp = require("socks5-http-client");
const getIp = async () => {
  let res = await axios.get("http://checkip.amazonaws.com/", {
    httpAgent,
    httpsAgent,
  });
  console.log(res.data, "ip address");
  if (res.data) return res.data;
};

const torControl = async () => {
  let password =
    "16:DE706878136E03C160423CA685E19824AD4CD88ABF5014763033ABFA20";
  tr.TorControlPort.password = "mytor";
  tr.setTorAddress("localhost", 9050);
  tr.newTorSession(function (err, mes) {
    if (err) {
      console.log(err, "error");
      return null;
    }
    console.log(mes, "message");
  });
};

module.exports = {
  torControl,
};
// app.listen(3001, async () => {
//   console.log("listening");
//   torControl();
// });
