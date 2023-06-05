const { graphql, buildSchema } = require("graphql");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mysql = require("mysql");

const app = express();
app.use(express.json());

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "user_favoritesongg",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to MySQL database!");
  }
});
//TYPE USER har id namn och string
//TYPE SONG har sondID och songName
// Define your GraphQL schema
const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    age: Int!
    songs: [Song]
  }
  
  type Song {
    songId: Int!
    songName: String!
  }

  type Query {
    getUser(id: ID!): User
    getUsers: [User]
    getSong(songId: ID!): Song
    getSongs: [Song]
  }

  type Mutation {
    createUser(id: ID!, name: String!, age: Int!): User
    updateUser(id: ID!, name: String!, age: Int!): User
    deleteUser(id: ID!): Boolean
    createSong(songId: ID!, songName: String!): Song
    deleteSong(songId: ID!): Boolean
    addSongToUser(userId: ID!, songId: String!): Boolean
  }
`);

// Define resolvers to handle the GraphQL operations
const root = {
  // Resolver functions for Query operations
  getUser: ({ id }) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM users WHERE id = ?",
        [id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  },
  getUsers: () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM users", (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  getSong: ({ songId }) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM favorite_songs WHERE song_id = ?",
        [parseInt(songId)],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            if (results.length > 0) {
              const song = {
                songId: parseInt(results[0].song_id),
                songName: results[0].song_name,
              };
              resolve(song);
            } else {
              resolve(null); // Return null if no song is found
            }
          }
        }
      );
    });
  },

  getSongs: () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM favorite_songs", (error, results) => {
        if (error) {
          reject(error);
        } else {
          const songs = results.map((song) => ({
            songId: parseInt(song.song_id),
            songName: song.song_name,
          }));
          resolve(songs);
        }
      });
    });
  },

  // Resolver functions for Mutation operations
  createUser: ({ id, name, age }) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO users (id, name, age) VALUES (?, ?, ?)",
        [id, name, age],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve({ id, name, age });
          }
        }
      );
    });
  },
  updateUser: ({ id, name, age }) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE users SET name = ?, age = ? WHERE id = ?",
        [name, age, id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve({ id, name, age });
          }
        }
      );
    });
  },
  deleteUser: ({ id }) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM users WHERE id = ?",
        [id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(true);
          }
        }
      );
    });
  },
  createSong: ({ songId, songName }) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO favorite_songs (song_id, song_name) VALUES (?, ?)",
        [songId, songName],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve({ songId, songName });
          }
        }
      );
    });
  },
  deleteSong: ({ songId }) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM favorite_songs WHERE song_id = ?",
        [songId],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(true);
          }
        }
      );
    });
  },
  addSongToUser: ({ userId, songId }) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO favorite_songs (song_id, song_name) VALUES (?, ?)",
        [userId, songId],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(true);
          }
        }
      );
    });
  },
};

// Define the GraphQL endpoint with GraphiQL
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

// Start the server
app.listen(5500, () => {
  console.log("GraphQL server is running on http://localhost:5500/graphql");
});
