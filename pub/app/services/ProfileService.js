var fetchUser = function(callback) {
  $.ajax({
    type: 'GET',
    url: '/profile/',
    crossDomain: true,
    success: function(resp) {
      callback(resp);
    },
    error: function(resp) {
      callback(null);
    }
  });
};

var fetchUserById = function(id,callback) {
  $.ajax({
    type: 'GET',
    url: '/user/'+id,
    crossDomain: true,
    success: function(resp) {
      callback(resp);
    },
    error: function(resp) {
      callback(null);
    }
  });

};

var updateUser = function(bio,avatar,callback) {
  return $.ajax({
    type: 'POST',
    url: '/profile/',
    data: JSON.stringify({
      "bio": bio,
      "avatar_link": avatar
    }),
    crossDomain: true,
    success: function(resp) {
      callback(resp);
    },
    error: function(resp) {
      callback(null);
    }
  });
};

var Profile = {
  fetch: function(callback) {
    var that = this;
    fetchUser((function(res) {
        if (callback) {
          callback(res);
        }
        that.onChange(res);
    }));
  },

  fetchById: function(id,callback) {
    var that = this;
    fetchUserById(id,(function(res) {
        if (callback) {
          callback(res);
        }
        that.onChange(res);
    }));
  },
  
  update: function(bio, avatar, callback) {
    var that = this;
    console.log(JSON.stringify({bio:bio,avatar_link:avatar}));
    updateUser(bio, avatar, function(res) {
      if (callback) {
        callback(res);
      }
      that.onChange(res);
    });
  },

  delete: function(callback) {
    if (callback) {
      callback();
    }
    this.onChange(false);
  },

  onChange: function() {}
};

module.exports = Profile;