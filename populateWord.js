const {removeStopwords} = require('stopword');
const words = require('./words.js').split('\n');

console.log(words);

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'ideas'
});
 
connection.connect();
 
words.forEach(word => {
    console.log('query', `INSERT INTO words {0, 1, '${word}', '', true}`)
    connection.query(`INSERT INTO Words (category, word, createdAt, updatedAt) VALUES (1, '${word.replace(/\'/g, '')}', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}')`, function (error, results, fields) {
        if (error) throw error;
      });
})

 
connection.end();

