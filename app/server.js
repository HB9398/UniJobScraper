const cron = require('node-cron');

const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();


const url = 'https://ischool.uw.edu/about/jobs/students';

const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., Gmail, Outlook
  auth: {
    user: 'cronharenbhatia@gmail.com',
    pass: 'oqjoojrgtorlqpfe',
    //pass: 'cronharen9398$', 

  },
});

const sendEmail = (data) => {
  const mailOptions = {
    from: 'cronharenbhatia@gmail.com',
    to: 'cronharenbhatia@gmail.com',
    subject: 'Web Scraping Report',
    text: JSON.stringify(data),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

const scrapeWebsite = () => {
  axios(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $('table');
      const tableData = [];
      table.find('tr').each((i, row) => {
        const rowData = {};
        $(row)
          .find('td, th')
          .each((j, cell) => {
            rowData[$(cell).text()] = j;
          });

        tableData.push(rowData);
      });

      console.log(tableData);
      console.log(tableData.length - 1);

      sendEmail(tableData.length-1);
    })
    .catch((err) => console.log(err));
};

// Schedule the cron job to run once every 2 days
cron.schedule('0 */48 * * *', () => {
  console.log('Running JS web scraping job');
  scrapeWebsite();
});


