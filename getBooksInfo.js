const puppeteer = require('puppeteer');
const fs = require('fs');
let browser

async function scrapeBookInfo(url) {

    const page = await browser.newPage();
    await page.goto(url);

    const title = await page.$eval('.booktitle', element => element.textContent.trim());
    const author = await page.$eval('.bookauthor>a', element => element.textContent.trim());
    const category = await page.$eval('.smaller', element => element.textContent.trim());
    const description = await page.$eval('.smaller:nth-child(3)', element => element.textContent.trim());
    const coverUrl = await page.$eval('.cover', element => element.getAttribute('src'));


    return {title, author, category, description, url, coverUrl};
}
fs.writeFileSync('scraped_data.json', '[\n', { flag: 'w' });

async function main() {
    browser = await puppeteer.launch();
    const urls = fs.readFileSync('book_urls.txt', 'utf8').split('\n').filter(url => url.trim() !== '');

    const scrapedData = [];
    let i = 0
    for (const url of urls) {
        i++
        console.log(`scrap book : ${i}`)
        const info = await scrapeBookInfo(url.trim());
        fs.writeFileSync('scraped_data.json', JSON.stringify(info, null, 2) + (i < urls.length ? ',\n' : '\n'), { flag: 'a' });
        //if(i==3) break
    }


    fs.writeFileSync('scraped_data.json', ']', { flag: 'a' });
    await browser.close();
}

main();
