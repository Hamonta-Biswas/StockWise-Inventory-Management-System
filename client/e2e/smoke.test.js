import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const baseUrl = process.env.APP_URL || 'http://localhost:5173';
const options = new chrome.Options();
options.addArguments('--window-size=1440,1000');
if (process.env.HEADLESS !== 'false') options.addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage');

const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
try {
  await driver.get(baseUrl);
  await driver.wait(until.titleIs('StockWise | Inventory Management'), 10000);
  await driver.wait(until.elementLocated(By.css('button.nav-link')), 10000);
  const productNav = await driver.findElement(By.xpath("//button[contains(., 'Products')]"));
  await productNav.click();
  await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Products')]")), 5000);
  console.log('Selenium smoke test passed: application opens and Products navigation works.');
} finally {
  await driver.quit();
}
