var addComment = function(threadId,body,callback) {
  return $.ajax({
    type: 'POST',
    url: '/posts/',
    data: JSON.stringify({
      "thread_id": parseInt(threadId),
      "contents": body
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


var fetchComment = function(id,callback) {
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

// Grabs Comments for page number
var fetchPage = function(threadId, page, callback) {
  $.ajax({
    type: 'GET',
    url: '/posts/?threadid='+threadId+'&sortby=rating&pagenumber='+page,
    crossDomain: true,
    success: function(resp) {
      callback(resp);
    },
    error: function(resp) {
      callback(null);
    }
  });

};

var fetchUserPage = function(page, callback) {
  $.ajax({
    type: 'GET',
    url: '/profilethreads/?sortby=rating&pagenumber='+ page,
    crossDomain: true,
    success: function(resp) {
      callback(resp);
    },
    error: function(resp) {
      callback(null);
    }
  });
};

var editComment = function(post_id,body,callback) {
  return $.ajax({
    type: 'PUT',
    url: '/post/',
    data: JSON.stringify({
      "post_id": parseInt(post_id),
      "contents": body
    }),
    crossDomain: true,
    success: function(resp) {
      console.log('success',resp);
      return callback(resp);
    },
    error: function(resp) {
      if(resp.responseText === ""){
        callback(resp);
      }else{
        callback(null);
      }
    }
  });
};

var deleteComment = function(post_id,callback) {
  return $.ajax({
    type: 'DELETE',
    url: '/post/'+post_id,
    crossDomain: true,
    success: function(resp) {
      callback(resp);
    },
    error: function(resp) {
      callback(null);
    }
  });
};

var upVote = function(post_id, callback) {
  console.log('upvoting...',post_id);
  $.ajax({
    type: 'POST',
    url: '/post/'+ post_id + '/?upvote=true',
    crossDomain: true,
    success: function(resp) {
      callback(resp);
    },
    error: function(resp) {
      callback(null);
    }
  });

};

var downVote = function(post_id, callback) {
  console.log('downvoting...',post_id);
  $.ajax({
    type: 'POST',
    url: '/post/'+ post_id + '/?downvote=true',
    crossDomain: true,
    success: function(resp) {
      callback(resp);
    },
    error: function(resp) {
      callback(null);
    }
  });

};

var Comment = {

  fetchPage: function(threadId, page, callback) {
    var that = this;
    fetchPage(threadId, page ,function(res) {
        if (callback) {
          callback(res);
        }
        that.onChange(res);
    });
  },

  fetchUserPage: function(page,callback) {
    var that = this;
    fetchUserPage(page,function(res) {
        if (callback) {
          callback(res);
        }
        that.onChange(res);
    });
  },

  add: function(threadId, body, callback) {
    var that = this;

    addComment(threadId, body, function(res) {
      if (callback) {
        callback(res);
      }
      that.onChange(res);
    });

  },
  
  edit: function(post_id, body, callback) {
    var that = this;
    editComment(post_id, body, function(res) {
      if (callback) {
        callback(res);
      }
      that.onChange(res);
    });
  },

  delete: function(post_id, callback) {
    var that = this;
    deleteComment(post_id, function(res) {
      if (callback) {
        callback(res);
      }
      that.onChange(res);
    });
  },

  upVote: function(post_id,callback){
    var that = this;

    upVote(post_id, function(res) {
      if (callback) {
        callback(res);
      }
      that.onChange(res);
    });

  },

  downVote: function(post_id,callback){
    var that = this;

    downVote(post_id, function(res) {
      if (callback) {
        callback(res);
      }
      that.onChange(res);
    });

  },


  onChange: function() {}
};

module.exports = Comment;