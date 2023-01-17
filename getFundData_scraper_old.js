const puppeteer = require('puppeteer');

async function getFundData(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let data = {
        name: '',
        url:url,
        date: '',
        oneDay: '',
        oneMonth: '',
        threeMonths: '',
        oneYear: ''
    }

    await page.goto(url, { waitUntil: 'networkidle0' });

    //NAME
    let name = await page.evaluate( () => document.querySelector('body > aza-app > aza-shell > div > main > div > aza-fund-guide > aza-subpage > div > div > div > div:nth-child(1) > h1').outerHTML );
    name = name.slice(50, -13);
    data.name = name;
    //NAME

    //DATE
    let date = await page.evaluate( () => document.querySelector('body > aza-app > aza-shell > div > main > div > aza-fund-guide > aza-subpage > div > div > div > div:nth-child(2) > div > aza-card > div:nth-child(2) > section:nth-child(1) > div:nth-child(2) > span:nth-child(1)').outerHTML );
    date = date.slice(69, 75);
    data.date = date;
    //DATE

    //ONE DAY
    let oneDay = await page.evaluate( () => document.querySelector('body > aza-app > aza-shell > div > main > div > aza-fund-guide > aza-subpage > div > div > div > div:nth-child(2) > div > aza-card > div:nth-child(2) > section:nth-child(1) > div:nth-child(2) > span:nth-child(2)').outerHTML );
    data.oneDay = getPercentage(oneDay);
    //ONE DAY

    //ONE MONTH
    let oneMonth = await page.evaluate( () => document.querySelector('body > aza-app > aza-shell > div > main > div > aza-fund-guide > aza-subpage > div > div > div > div:nth-child(2) > div > aza-card > div.chart-wrapper > aza-area-chart > div > aza-period-picker > div > aza-period-button:nth-child(1) > button > span:nth-child(2)').outerHTML );
    data.oneMonth = getPercentage(oneMonth);
    //ONE MONTH

    //THREE MONTHS
    let threeMonths = await page.evaluate( () => document.querySelector('body > aza-app > aza-shell > div > main > div > aza-fund-guide > aza-subpage > div > div > div > div:nth-child(2) > div > aza-card > div.chart-wrapper > aza-area-chart > div > aza-period-picker > div > aza-period-button:nth-child(2) > button > span:nth-child(2)').outerHTML );
    data.threeMonths = getPercentage(threeMonths);
    //THREE MONTHS

    //THIS YEAR
    let thisYear = await page.evaluate( () => document.querySelector('body > aza-app > aza-shell > div > main > div > aza-fund-guide > aza-subpage > div > div > div > div:nth-child(2) > div > aza-card > div.chart-wrapper > aza-area-chart > div > aza-period-picker > div > aza-period-button:nth-child(3) > button > span:nth-child(2)').outerHTML );
    data.thisYear = getPercentage(thisYear);
    //THIS YEAR

    //ONE YEAR
    let oneYear = await page.evaluate( () => document.querySelector('body > aza-app > aza-shell > div > main > div > aza-fund-guide > aza-subpage > div > div > div > div:nth-child(2) > div > aza-card > div.chart-wrapper > aza-area-chart > div > aza-period-picker > div > aza-period-button:nth-child(4) > button > span:nth-child(2)').outerHTML );
    data.oneYear = getPercentage(oneYear);
    //ONE YEAR
    

    console.log(data);

    await browser.close();

    return data;
}


function getPercentage(str){
    str = />(.+)/.exec(str)[1]; //Remove first part of string
    str = str.slice(0, -7); //Remove second part of string
    return str;
}

module.exports = { getFundData };