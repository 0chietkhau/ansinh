import { configureToMatchImageSnapshot } from 'jest-image-snapshot';
import puppeteer from 'puppeteer';
import fs from 'fs';

const customConfig = { threshold: 0.08 };
const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customDiffConfig: customConfig,
  failureThreshold: 330,
  noColors: true,
});

expect.extend({ toMatchImageSnapshot });

let browser: puppeteer.Browser;
beforeAll(async () => {
  browser = await puppeteer.launch();
}, 30_000);
it(`renders correctly`, async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:8081');
  await page.screenshot({
    path: '/tmp/screenshot.png',
  });
  const image = fs.readFileSync('/tmp/screenshot.png');
  expect(image).toMatchImageSnapshot();
  await page.close();
}, 30_000);
afterAll(async () => {
  await browser.close();
}, 30_000);
