const fs = require('fs')
const axios = require('axios')
const Crypto = require('crypto')

const FILENAME = "jokes.json"
const URL = 'https://icanhazdadjoke.com/'
const OPTIONS = { headers: { 'Accept': 'application/json', 'User-Agent': 'dadbod' }}

const store = require('./jokes.json')

async function get_joke() {
    console.log('Fetching Dad Joke...')

    let response;
    try {
        response = await axios.get(URL, OPTIONS);
    } catch (ex) {
        console.log('Exception')
        console.log(ex)
        return
    }
    
    console.log(response.data)
    store.jokes.push(response.data)

    save_jokes()
}

async function add_kv(key, value) {
    store.jokes.map(joke => {
        joke[key] = eval(value)
    })

}

async function save_jokes() {
    fs.writeFile(FILENAME, JSON.stringify(store, null, 2), function (err) {
        if (err) return console.log(err)
        console.log('saved')
    });
}

function random_string(size = 10) {  
    return Crypto
      .randomBytes(size)
      .toString('base64')
      .slice(0, size)
  }

if (process.argv.length === 2) {
    get_joke()
    save_jokes()
    return
}

if (process.argv.length === 4) {
    const key = process.argv[2]
    const value = process.argv[3]
    add_kv(key, value) 
    save_jokes()
    return
}

console.log(`
Usage:
   ${process.argv[0]} ${process.argv[1]}                       : Add Joke
   ${process.argv[0]} ${process.argv[1]} foo bar               : Add {"foo": "bar"} to all jokes
   ${process.argv[0]} ${process.argv[1]} foo "random_string()" : Add {"foo": "kxI5kv7L0y"} to all jokes
`)