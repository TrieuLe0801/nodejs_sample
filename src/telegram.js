const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('/home/trieulv/nodejs/src/config.json');
const cookies = require('/home/trieulv/nodejs/src/cookies.json');
const readline = require('readline-sync');

(async () => {
    let url = 'https://web.telegram.org/';
    let browser = await puppeteer.launch({headless: false});
    let page = await browser.newPage();

    if (Object.keys(cookies).length){
        await page.setCookie(...cookies);
        await page.goto(url, {waitUntil: 'networkidle2'});
    }else{
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

        await page.click('[class="login_head_submit_btn"]');
        console.log('Access phone number: '+config.phone_number);

        // await page.waitForNavigation({waitUntil: 'networkidle0'});
        // await page.waitFor(15000);
        // console.log('Access phone number: '+config.phone_number);

        await page.waitFor('[class="modal-dialog"]');
        console.log('loaded dialog');
        await page.click('[class="btn btn-md btn-md-primary"]');

        var codeConfirm = "";
        await page.waitFor(5000);
        codeConfirm = readline.question(`Enter the code\n`);
        await page.type('[ng-model="credentials.phone_code"]', codeConfirm, {delay: 30});

        
        // await page.waitFor('[class="im_dialog_photo"]');
        // console.log('loaded into telegram');
        // await page.click('[src="blob:https://web.telegram.org/8799b089-0ea3-4c0a-b0ea-6918e2e5c5d1"]');
        // console.log('clicked bot');

        await page.waitForNavigation({waitUntil: 'networkidle0'});
        await page.setDefaultNavigationTimeout(0)

        // try{
        //     var time = 0
        //     await page.click('[src="blob:https://web.telegram.org/8799b089-0ea3-4c0a-b0ea-6918e2e5c5d1"]');
        //     // while(true){
               
        //     // }

        // }catch(error){
        //     console.log('Failed to login.');
        //     process.exit(0);
        // }

        let currentCookies = await page.cookies();

        fs.writeFileSync('/home/trieulv/nodejs/src/cookies.json', JSON.stringify(currentCookies));

    }

    debugger;

    
})();