const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const { Connection } = require("mongoose");
let instance = null;

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "bms",
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  // console.log('db ' + connection.state);
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }
  async newUserRegistration(user) {
    try {
     connection.query('SELECT username FROM users WHERE username = ?',[user.username], async (error, results)=>{
        if(error){
            console.log(error);
        }
        if(results.length>0){
            console.log("User already exist");
            return 
            
        }
      const password = user.password;
      const encryptedPassword = await bcrypt.hash(
        password,
        bcrypt.genSaltSync(9)
      );
      user.password = encryptedPassword;
      const query =
        "INSERT INTO users (name, email, username, password) values(?,?,?,?);";

      connection.query(
        query,
        [user.name, user.email, user.username, user.password],
        (err, results) => {
          if (err) reject(new Error(err.message));
          return(results);
        }
      );
    });
    } catch (err) {
      console.log(err);
    }
  }


  async loginValidation(user){
        try{
            console.log("user",user);
            
        if(!user.username || !user.password){
            console.log("Please provide username and password");
        }
        connection.query('SELECT * FROM USERS WHERE username = ?', [user.username], async(error, result)=>{
            if(!result || !(await bcrypt.compare(user.password,result[0].password))){
                res.status(400).render('login',{message:"The username or password is incorrect"});
            }
            console.log('Logged in');
            
            res.redirect('/');
        });

        }catch(err){
            console.log(err);
            
        }
  }



  async getAllEventsData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM events;";

        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllMoviesData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM movies;";

        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async insertNewEvent(event) {
    try {
      const dateAdded = new Date();
      const insertId = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO Events (name, theatre,show_date,show_time) VALUES (?,?,?,?);";

        connection.query(
          query,
          [event.name, event.theatre, event.showdate, event.showdate],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          }
        );
      });
      return {
        id: insertId,
        name: event.name,
        theatre: event.theatre,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async loginValidation(user){
    try{
        const response = await new Promise((resolve,reject)=>{
            const query = "SELECT passsword from USERS WHERE username=?"
            connection.query(query,[user.username],(err,result)=>{
                if(err) return err;
                resolve(result);
                
                
            });
        });
        hash = response[0];
        myPlaintextPassword = user.password
        bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
            if(err) return
            return result
        });
        return response
    }
    catch(err){
        console.log(err);
        
    }
  }
  async insertNewMovie(movie) {
    try {
      const dateAdded = new Date();
      const insertId = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO Movies (name, theatre,show_date,show_time) VALUES (?,?,?,?);";

        connection.query(
          query,
          [movie.name, movie.theatre, movie.showdate, movie.showtime],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          }
        );
      });
      // return {
      //     id : insertId,
      //     name : movie.name
      // };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteRowEventById(event_id) {
    try {
      let id = parseInt(event_id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM events WHERE event_id = ?";

        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async deleteRowMovieById(movieid) {
    try {
      let id = parseInt(movieid, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM movies WHERE movie_id = ?";

        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateEventById(event) {
    try {
      let id = parseInt(event.id, 10);
      const response = await new Promise((resolve, reject) => {
        const query =
          "UPDATE events SET name = ?,theatre = ?,show_date = ?,show_time = ?  WHERE event_id = ?";

        connection.query(
          query,
          [event.name, event.theatre, event.showdate, event.showtime, id],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          }
        );
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async updateMovieById(movie) {
    try {
      let id = parseInt(movie.id, 10);
      console.log("id ", id);
      const response = await new Promise((resolve, reject) => {
        const query =
          "UPDATE movies SET name = ?, theatre = ? ,show_date= ?, show_time = ? WHERE movie_id=?";
        connection.query(
          query,
          [movie.name, movie.theatre, movie.showdate, movie.showdate, id],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          }
        );
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async searchByMoiveId(movie_id) {
    try {
      let id = parseInt(movie_id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM movies WHERE movie_id = ?;";

        connection.query(query, [id], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async searchByEventId(id) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM Events WHERE event_id = ?;";

        connection.query(query, [id], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = DbService;
