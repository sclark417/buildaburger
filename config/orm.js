// Require the connection to the sql database established in connection.js
const connection = require('./connection.js');

// SQL syntax to add question marks (?, ?, ?) in query
const createQuestionMarks = (num) => {
  //Creating a variable that is a an empty questionArray to push the ? to.
  const questionArr = [];
  //Creating a for loop that will create the questions marks depending on what number is passed into the function through the num param.
  for (let i = 0; i < num; i++) {
    questionArr.push('?');
  }
  //return the questionArray with the created ? marks used the .toString() method to create a string of the question marks so it will go into the sql command nicely. 
  return questionArr.toString();
};

// Helper function to convert object key/value pairs to SQL syntax. Passing the ob param through the function.

const objToSql = (ob) => {
  //Creating an empty array that will hold the key value pairs
  const arr = [];

  // Loop through the keys and push the key/value as a string int arr
  for (const key in ob) {
    
    let value = ob[key];
    //
    if (Object.hasOwnProperty.call(ob, key)) {
      // If string with spaces add quotes so it can be passed into the sql function.
           
      if (typeof value === 'string' && value.indexOf(' ') >= 0) {
        value = `'${value}'`;
      }
     
      //add the key value pairs to the empty array
      arr.push(`${key}=${value}`);
    }
  }

  // Return the array of key values pairs with the .toString() method.
  return arr.toString();
};

// Object for all our SQL statement functions.
const orm = {
  //Creating the function will display all of the results that are in the burger database
  all(tableInput, cb) {

    const queryString = `SELECT * FROM ${tableInput};`;
    connection.query(queryString, (err, result) => {
      if (err) {
        throw err;
      }
      cb(result);
    });
  },
  //The function necessary for creating a new record in the burger table
  create(table, cols, vals, cb) {
    let queryString = `INSERT INTO ${table}`;

    //Concatenations using the above established variables to complete the string that will be our sql command. Will read something like this.
    // "INSERT INTO burgers (id,name,devoured) VALUES (???)
    queryString += ' (';
    queryString += cols.toString();
    queryString += ') ';
    queryString += 'VALUES (';
    queryString += createQuestionMarks(vals.length);
    queryString += ') ';

    console.log(queryString);

    connection.query(queryString, vals, (err, result) => {
      if (err) {
        throw err;
      }

      cb(result);
    });
  },
  //function necessary to update the the available burger records.
  update(table, objColVals, condition, cb) {
    let queryString = `UPDATE ${table}`;

    queryString += ' SET ';
    queryString += objToSql(objColVals);
    queryString += ' WHERE ';
    queryString += condition;

    console.log(queryString);
    connection.query(queryString, (err, result) => {
      if (err) {
        throw err;
      }

      cb(result);
    });
  },
  //function necessary to delete the burger records from the table.
  delete(table, condition, cb) {
    let queryString = `DELETE FROM ${table}`;
    queryString += ' WHERE ';
    queryString += condition;

    connection.query(queryString, (err, result) => {
      if (err) {
        throw err;
      }

      cb(result);
    });
  },
};

// Export the orm object for the model (burger.js).
module.exports = orm;
