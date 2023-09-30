const mysql = require('mysql');
require('dotenv').config();

function connectToDatabase()
{
    const connection = mysql.createConnection(
        {
            host:process.env.DATABASE_HOST,
            port:process.env.DATABASE_PORT,
            database:process.env.DATABASE_NAME,
            user:process.env.DATABASE_USER,
            password:""
    
        }
    );

    const connect = connection.connect((err)=>{
        if(err)
        {
            console.log("An Error Ocuured During Connect to database");
        }
        else{
            console.log(`Connected To Database`);
        }
    });

    return connection
}


module.exports = connectToDatabase;