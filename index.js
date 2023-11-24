const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');
const { default: axios } = require('axios');
app.use(cors());
app.use(express.json());

const PORT = 3031;

async function getFund(fundURL) {
  const match = fundURL.match(/\.html\/(\d+)/);
  const id = match ? match[1] : null;

  if (!id) return;

  let res;

  try {
    res = await axios.get(`https://www.avanza.se/_api/fund-guide/guide/${id}`);
    console.log('Fetched', res.data.name);

    if (res.data) {
      return {
        name: res.data.name,
        url: fundURL,
        date: res.data.navDate,
        oneDay: res.data.developmentOneDay,
        oneMonth: res.data.developmentOneMonth,
        threeMonths: res.data.developmentThreeMonths,
        oneYear: res.data.developmentOneYear,
        thisYear: res.data.developmentThisYear,
      };
    }
  } catch (err) {
    //console.log(err);
    console.log('error');
  }
}

async function getAllFunds() {
  const fundURLs = JSON.parse(fs.readFileSync('./input/funds.json'));

  const date = new Date();
  const data = [];

  for (const fundURL of fundURLs) {
    data.push(await getFund(fundURL));
  }

  while (data.length < fundURLs.length) {
    setTimeout(async () => {
      for (let i = 0; i < fundURLs.length; i++) {
        if (!data[i]) {
          data.push(await getFund(fundURLs[i]));
        }
      }
    }, 10000);
  }

  //sort by name
  data.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  });

  fs.writeFile('./output/funds.json', JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.log(err);
    }
  });

  fs.writeFile('./output/update.json', JSON.stringify({ update: date.getTime() }), (err) => {
    if (err) {
      console.log(err);
    }
  });
}

//update once at startup.
getAllFunds();

//update every hour.
setInterval(() => {
  getAllFunds();
}, 3600000);

let options = { root: path.join(__dirname) };

app.get('/funds', (req, res) => {
  res.sendFile('./output/funds.json', options);
});

app.get('/update', (req, res) => {
  res.sendFile('./output/update.json', options);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
