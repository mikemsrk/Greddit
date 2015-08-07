var React = require('react');
var ThreadStore = require('../../stores/ThreadStore');
var ThreadActions = require('../../actions/ThreadActions');
var ProfileThreadItem = require('./profile-threaditem');

var BioThreads = React.createClass({
  // TODO: Incorporate Later when Auth is in.

  getInitialState: function(){
    return {
      page: 1,
      threads: []
    };
  },

  componentDidMount: function(){
    ThreadActions.fetchUserPage({page:this.state.page});
    ThreadStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    ThreadStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState({
      threads: ThreadStore.getUserThreads().forumThreads
    });
    console.log(this.state.threads);
  },

  prevPage: function(e){
    e.preventDefault();
    if(this.state.page > 1){
      this.setState({
        page: this.state.page-1
      });
      ThreadActions.fetchUserPage({page:this.state.page-1});
    }
  },

  nextPage: function(e){
    e.preventDefault();
    this.setState({
      page: this.state.page+1
    });
    ThreadActions.fetchUserPage({page:this.state.page+1});
  },

  render: function() {
    return (
      <div className="col-md-9">
        <h3>My Threads</h3>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Rating</th>
              <th>Title</th>
              <th>Body</th>
              <th>Submitted</th>
              <th>Created</th>
              <th>Updated</th>
            </tr>
          </thead>

          <tbody>
            {this.state.threads.map(function(item){
              return (
                <ProfileThreadItem key={item.thread_id} item={item}/>
              );
            })}
          </tbody>

        </table>
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

module.exports = BioThreads;