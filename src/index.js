const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('/home/trieulv/nodejs/src/config.json')
const cookies = require('/home/trieulv/nodejs/src/cookies.json');

(async () => {
    let url = 'https://www.facebook.com/';
    let browser = await puppeteer.launch({headless: false});
    let page = await browser.newPage();

    if (Object.keys(cookies).length){
        await page.setCookie(...cookies);
        await page.goto(url, {waitUntil: 'networkidle2'});
    }else{
        await page.goto(url, {waitUntil: 'networkidle2'});
        await page.type('#email', config.email, {delay: 30});
        await page.type('#pass', config.password, {delay: 30});

        await page.click('[data-testid="royal_login_button"]');

        await page.waitForNavigation({waitUntil: 'networkidle0'});
        await page.waitFor(15000);

        try{
            await page.waitFor('[data-click="profile_icon"]');

        }catch(error){
            console.log('Failed to login.');
            process.exit(0);
        }

        let currentCookies = await page.cookies();

        fs.writeFileSync('/home/trieulv/nodejs/src/cookies.json', JSON.stringify(currentCookies));

    }

    debugger;

    
})();