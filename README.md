# MYSQL_EXPRESS_GRAPHQL

Crud for users and songs
add a song to a user show the song with the user togheter. NO frontend use graphiql to test endpoints
//GET USERS
query {
  getUsers {
    id
    name
    age
  }
}

//GET USER BY ID
query {
  getUser(id: 2) {
    id
    name
    age
  }
}
//CREATE USER
mutation {
  createUser(id: "2", name: "Majid", age: 20) {
    id
    name
    age
  }
}
//UPDATE USER
mutation {
  updateUser(id: "2", name: "Majid", age: 25) {
    id
    name
    age
  }
}
//DELETE USER
mutation {
  deleteUser(id: "2")
}

//GEt SONGS
query {
  getSongs {
    songId
    songName
  }
}






//Get SONG
query {
  getSong(songId: 2) {
    songId
    songName
  }
}
//POST SONG
mutation {
  createSong(songId: "2", songName:"Afghan"){
     songId
    songName
  }
}

//DELETE SONG BY ID
mutation {
  deleteSong(songId: "2")
}   
//ADD SONG TO A USER
mutation {
  addSongToUser(userId: "3", songId: "7")
}

