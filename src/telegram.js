const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('/home/trieulv/nodejs/src/config.json');
const cookies = require('/home/trieulv/nodejs/src/cookies.json');
const readline = require('readline-sync');

(async () => {
    let url = 'https://web.telegram.org/#';
    let browser = await puppeteer.launch({headless: false});
    let page = await browser.newPage();

    if (Object.keys(cookies).length){
        await page.setCookie(...cookies);
        await page.goto(url, {waitUntil: 'networkidle2'});
    }else{
        try{   
            await page.goto(url, {waitUntil: 'networkidle2'});
            await page.waitFor('[ng-model="credentials.phone_country"]');
            const inputValue = await page.$eval('[ng-model="credentials.phone_country"]', el => el.value);
            console.log(inputValue);
            if (inputValue.toString()!=='+84'){
                await page.evaluate(function() {
                    document.querySelector('[ng-model="credentials.phone_country"]').value = ''
                })
                await page.type('[ng-model="credentials.phone_country"]', config.phone_code, {delay: 30});
                console.log("Changed the phone code");
            }
            
            await page.type('[name="phone_number"]', config.phone_number, {delay: 30});
            console.log('Enter phone number: '+config.phone_number);

            await page.waitFor(5000);
            await page.click('[class="login_head_submit_btn"]');
            console.log('Access phone number: '+config.phone_number);

            await page.waitFor('[class="modal-dialog"]');
            console.log('loaded dialog');

            await page.waitFor(5000);
            await page.click('[class="btn btn-md btn-md-primary"]');

            var codeConfirm = "";
            await page.waitFor(5000);
            codeConfirm = readline.question(`Enter the code: \n`);
            await page.type('[ng-model="credentials.phone_code"]', codeConfirm, {delay: 30});
            
            await page.waitForNavigation();

            const bot_url = 'https://web.telegram.org/#/im?p=@BTC_Ads_sg_bot';

            await page.goto(bot_url, {waitUntil: 'networkidle2'});
            console.log("access bot");

            await page.waitFor('[ng-switch-default class = "btn reply_markup_button"]');
            await page.click('[ng-switch-default class = "btn reply_markup_button"]');
            console.log("Clicked ");

            await page.waitForNavigation();

            
            
            // await page.waitFor(30000);
            

        }catch(error){
            console.log(error);
            process.exit(0);
        }

        let currentCookies = await page.cookies();

        fs.writeFileSync('/home/trieulv/nodejs/src/cookies.json', JSON.stringify(currentCookies));

    }

    debugger;

    
})();