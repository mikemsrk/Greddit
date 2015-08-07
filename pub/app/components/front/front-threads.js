var React = require('react');
var ThreadStore = require('../../stores/ThreadStore');
var ThreadActions = require('../../actions/ThreadActions');
var ThreadItem = require('./front-threaditem');

// Front page threads
// Fetch threads by rating by page

var Threads = React.createClass({
  getInitialState: function(){
    return {
      page: 1,
      threads: [],
      alert: false
    };
  },

  componentDidMount: function(){
    ThreadActions.fetchPage({page:this.state.page});
    ThreadStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    ThreadStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState({
      threads: ThreadStore.getThreads().forumThreads
    });
  },

  upVote: function(id){
    // TODO: call thread action to upvote
    ThreadActions.upVote({thread_id:id});
  },

  downVote: function(id){
    // TODO: call thread action to downvote
    ThreadActions.downVote({thread_id:id});
  },

  goThread: function(id){
    console.log('transitioning to...thread',id);
  },

  showAlert: function(){
    this.props.onAlert();
  },

  prevPage: function(e){
    e.preventDefault();
    if(this.state.page > 1){
      this.setState({
        page: this.state.page-1
      });
      ThreadActions.fetchPage({page:this.state.page-1});
    }
  },

  nextPage: function(e){
    e.preventDefault();
    this.setState({
      page: this.state.page+1
    });
    ThreadActions.fetchPage({page:this.state.page+1});
  },

  render: function() {
    return (
      <div className="threads">
        <p className="showing">showing {this.state.threads.length} threads out of {this.state.threads.length} </p>
          {
            this.state.threads.map(function(item){
              return (
                <ThreadItem 
                  ref = "thread"
                  onAlert = {this.showAlert}
                  loggedIn = {this.props.loggedIn}
                  onGoThread = {this.goThread} 
                  onUpVote = {this.upVote} 
                  onDownVote = {this.downVote} 
                  key = {item.thread_id} 
                  item = {item} />
              );
            },this)
          }
          <div className="row">
            <div className="col-lg-12 centered">
              <a href="#" ref="left" className="glyphicon glyphicon-chevron-left" aria-hidden="true" onClick={this.prevPage}></a> 
              &nbsp;{this.state.page}&nbsp;
              <a href="#" ref="right" className="glyphicon glyphicon-chevron-right" aria-hidden="true" onClick={this.nextPage}></a>
            </div>
          </div>
      </div>
    );
  }
});

module.exports = Threads;