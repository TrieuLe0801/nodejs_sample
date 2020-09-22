const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('./src/config.json');
const cookies = require('./src/cookies.json');
const readline = require('readline-sync');

(async () => {
    let url = 'https://web.telegram.org/#';
    let browser = await puppeteer.launch({headless: false});
    let page = await browser.newPage();

    if (Object.keys(cookies).length){
        await page.setCookie(...cookies);
        await page.goto(url, {waitUntil: 'networkidle2'});
    }else{
        
            await page.goto(url, {waitUntil: 'networkidle2'});

            // Login
            // Load and change phone code
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
            
            // Type phone number
            await page.type('[name="phone_number"]', config.phone_number, {delay: 30});
            console.log('Enter phone number: '+config.phone_number);
            await page.waitFor(5000);

            // Click submit button 
            await page.click('[class="login_head_submit_btn"]');
            console.log('Access phone number: '+config.phone_number);

            // Load dialog alert
            await page.waitFor('[class="modal-dialog"]');
            console.log('loaded dialog');
            await page.waitFor(5000);
            await page.click('[class="btn btn-md btn-md-primary"]');

            // Insert confirm code from keyboard
            var codeConfirm = "";
            await page.waitFor(5000);
            codeConfirm = readline.question(`Enter the code: \n`);
            await page.type('[ng-model="credentials.phone_code"]', codeConfirm, {delay: 30});
            
            await page.waitForNavigation();

            const bot_url = 'https://web.telegram.org/#/im?p=@BTC_Ads_sg_bot';

            await page.goto(bot_url, {waitUntil: 'networkidle2'});
            console.log("access bot");

         
            await page.waitForSelector('[ng-click="buttonClick(button)"]');
            console.log("Load the message");

            await page.waitFor(15000);

        try{   
            await page.waitFor('[ng-click="buttonClick(button)"]');
            var  i = 0
            //var datetime = new Date().toLocaleString();
            while (i < 101){
                var datetime = new Date().toLocaleString();
                await page.click('[ng-click="buttonClick(button)"]');
                i++;
                console.log("clicked "+i+"at "+datetime);
                await page.waitFor(30999);
            }
            await page.close();
            console.log("Stop account");
            // await page.waitFor(30000);
        }catch(error){
            console.log(error);
            process.exit(0);
        }

        let currentCookies = await page.cookies();

        fs.writeFileSync('./src/cookies.json', JSON.stringify(currentCookies));

    }

    debugger;

    
})();