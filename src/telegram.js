const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('../src/config.json');
// const cookies = require('../src/cookies.json');
const cookies ="";
const readline = require('readline-sync');
const phoneCode = readline.question(`Enter the phone code: \n`);
const phoneNumber = readline.question(`Enter the phone number: \n`);
const intervalLoop = parseInt(readline.question(`Enter the interval time to loops (suggest under 600 times): \n`));

(async () => {
    let url = config.telegram;
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
            if (inputValue.toString()!==phoneCode){
                await page.evaluate(function() {
                    document.querySelector('[ng-model="credentials.phone_country"]').value = ''
                })
                await page.type('[ng-model="credentials.phone_country"]', phoneCode, {delay: 30});
                console.log("Changed the phone code");
            }
            
            // Type phone number
            await page.type('[name="phone_number"]', phoneNumber, {delay: 30});
            console.log('Enter phone number: '+phoneNumber);
            await page.waitFor(5000);

            // Click submit button 
            await page.click('[class="login_head_submit_btn"]');
            console.log('Access phone number: '+phoneNumber);

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
            
            // Wait load the page
            await page.waitForNavigation();

            // Access the bot
            const bot_url = 'https://web.telegram.org/#/im?p=@BTC_Ads_sg_bot';
            await page.goto(bot_url, {waitUntil: 'networkidle2'});
            console.log("Access bot");

            // Wait the button load on
            await page.waitForSelector('[ng-click="buttonClick(button)"]');
            console.log("Load the message");

            // Wait before auto click
            // await page.waitFor(15000);

        try{   
            await page.waitFor('[ng-click="buttonClick(button)"]');
            var  i = 0;
            var datetime = "";
            var interval = setInterval( async () => {
                page.click('[ng-click="buttonClick(button)"]')
                    .then(() => {
                        datetime = new Date().toLocaleString();
                        i++;
                        console.log("clicked "+i+" at "+datetime);
                        if(i === intervalLoop){
                            clearInterval(interval); 
                            page.close();
                            console.log("App closed!")
                            console.log("Thank you for using and See you!");
                            process.exit(0);
                        }
                    });
            }, 30999);
        }catch(error){
            console.log(error);
            process.exit(0);
        }

        // let currentCookies = await page.cookies();

        // fs.writeFileSync('../src/cookies.json', JSON.stringify(currentCookies));

    }

    debugger;

    
})();
