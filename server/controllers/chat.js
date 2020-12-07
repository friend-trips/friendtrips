const axios = require('axios');

module.exports = {
  getComment: (message_id) => {
    return axios({
      method: 'get',
      url: 'https://morning-bayou-59969.herokuapp.com/comments/',
      data: {
        trip_id: 1
      }
    })
  }
}