import React from 'react';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      data: [],
      form:{}

    }
  }
  componentWillMount(){
    fetch(`http://localhost:5000/api/posts`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
      this.setState({data : data})

    })
    this.handleChange=this.handleChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
  }

   handleSubmit(event) {
    event.preventDefault();
    console.log(event)
    let form = this.state.form
    axios.post('http://localhost:5000/api/posts', form).then(response => {
      console.log("Slide added successful: ", response);
      fetch(`http://localhost:5000/api/posts`).then(resp => resp.json()).then(posts => {
        this.setState({data: posts});
      });
    }).catch(function(error) {
      console.log("Error: ", error);
    })
  }

  handleChange(e){
    e.preventDefault();
    // console.log(e)
  let sendPost = {...this.state.form}
   sendPost[e.target.id]=e.target.value;
   this.setState({form : sendPost});
  }

  render() {
    return (
      <div className="container">
         <div className="my-3">
              {this.state.data.map( (data, index) =>
               <div key={index} >
                <li>{data.name}</li>
                <li>{data.content}</li>
                <li>{data.order}</li>
                </div>
              )}

        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Name</label><br />
            <input className="form-control" onChange={this.handleChange} type="textarea" id="nameInput" />
          </div>
            <br />
          <div className="form-group">
            <label>Content</label><br />
            <input   className="form-control" onChange={this.handleChange} type="textarea" id="contentInput" />
          </div>
            <br />
          <div className="form-group">                       
            <label>Order</label><br />
            <input className="form-control" onChange={this.handleChange} type="textarea" id="orderInput" />
          </div>
            <br />
          <button className="btn btn-primary" onChange={(e) =>this.handleChange(e)} type="submit" value="Submit">Submit </button>
          </form>
      </div>
          </div>
          
            
     
    );
  }
}
export default App;
