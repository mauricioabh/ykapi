require('dotenv').config()
const e = require('express')
const { google } = require('googleapis')

google.youtube('v3').search.list({
  key: process.env.YOUTUBE_TOKEN,
  part: 'snippet',
  q: 'cocomelon',
  maxResults: 50
}).then((response) => {
  //console.log(response.data)
  const { data } = response
  console.log(data.items.length)
  console.log(data.items.map(item => {
    return (({ title, description }) => ({ title, description }))(item.snippet)
  }))}
).catch(err => console.log(err))