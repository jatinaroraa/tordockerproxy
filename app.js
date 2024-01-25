const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const ProxyPlugin = require("puppeteer-extra-plugin-proxy");
const { SocksProxyAgent } = require("socks-proxy-agent");
var cron = require("node-cron");
const { exec } = require("child_process");

puppeteer.use(StealthPlugin());
const youtubeVideoUrl = "https://www.youtube.com/watch?v=rXN37A1Z7lc";
const videoUrl = process.env.videoUrl;
var viewDeliverCount = 0;
const duration = 32000;
const torProxy = "socks5://localhost:9050";
const sock = "socks5://localhost:9050";
const express = require("express");
const { default: axios } = require("axios");
const { torControl } = require("./script");
const app = express();

const httpAgent = new SocksProxyAgent(sock);
const httpsAgent = new SocksProxyAgent(sock);

const script = async () => {
  // const ipChange = await changeIp();

  const browser = await puppeteer.launch({
    // executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      `--proxy-server=${torProxy}`,
    ],
    // args: [`--proxy-server=${torProxy}`],
  });
  let ip = await getIp();
  if (!ip) {
    return false;
  }
  console.log("starting new page with ip", ip);

  const page = await browser.newPage();
  try {
    // Set the viewport size
    await page.setViewport({ width: 1280, height: 720 });

    // Open the YouTube video
    await page.goto(`${videoUrl}`, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    const playButtonSelector = "button.ytp-play-button";
    const startTime = Date.now();

    // Wait for the play button to appear and click it
    await page.waitForSelector(playButtonSelector);
    await page.click(playButtonSelector);

    // Watch the video for the specified duration
    await page.waitForTimeout(duration);
    await page.screenshot({ path: `${startTime}.png` });

    // Close the browser
    await browser.close();
    const loadTime = Date.now() - startTime;

    let ip = await getIp();
    console.log(loadTime, "total time page load");
    viewDeliverCount++;
    return true;
  } catch (error) {
    console.log(error, "error");
    return false;
  }

  return false;
};

const getIp = async () => {
  let res = await axios.get("http://checkip.amazonaws.com/", {
    httpAgent,
    httpsAgent,
  });

  if (res.data) return res.data;
  else return null;
};
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function executeFunctions() {
  await torControl();
  await delay(1000); // Wait for 1000 milliseconds (1 second)
  await script();
}
app.listen(3001, async () => {
  console.log("listening");
  let loadtime = process.env.loadtime ? process.env.loadTime : 5;
  for (let i = 0; i < loadtime; i++) {
    await executeFunctions();
  }
  console.log("finish loop total view deliver : ", viewDeliverCount);
});
