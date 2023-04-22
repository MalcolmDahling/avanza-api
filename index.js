const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');
const { default: axios } = require('axios');
app.use(cors());
app.use(express.json());

const PORT = 3031;

async function getFund(fund){

    let res = await axios.get(`https://www.avanza.se/_api/fund-guide/guide/${fund.id}`);

    console.log('Fetched', res.data.name);

    return ({
        name: res.data.name,
        url: fund.url,
        date: res.data.navDate,
        oneDay: res.data.developmentOneDay,
        oneMonth: res.data.developmentOneMonth,
        threeMonths: res.data.developmentThreeMonths,
        oneYear: res.data.developmentOneYear,
        thisYear: res.data.developmentThisYear
    });
}

async function getAllFunds(){

    const fundsRaw = fs.readFileSync('./input/funds.json');
    const funds = JSON.parse(fundsRaw);
    console.log(funds);

    let date = new Date();
    let data = [];

    for(const fund of funds){

        data.push(await getFund(fund));
    }
    
    fs.writeFile('./output/funds.json', JSON.stringify(data), err => {

        if(err){
            console.log(err);
        }
    });

    fs.writeFile('./output/update.json', JSON.stringify({"update": date.getTime()}), err => {

        if(err){
            console.log(err);
        }
    })
}


//update once at startup.
getAllFunds();

//update every hour.
setInterval(() => {
    getAllFunds();
}, 3600000);


let options = {root: path.join(__dirname)};

app.get('/funds', (req, res) => {

    res.sendFile('./output/funds.json', options);
});

app.get('/update', (req, res) => {
    
    res.sendFile('./output/update.json', options);
});


//RAILWAY
// PORT = process.env.PORT;
// app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));