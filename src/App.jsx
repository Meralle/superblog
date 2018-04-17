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
    console.log(event.target.elements);
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
   const sendPost = {...this.state.form}
   sendPost[e.target.id]=e.target.value;
   this.setState({form : sendPost});
  }

  render() {
    return (

      <div>

      {this.state.data.map( (data, index) =>
       <div key={index} >
        <li>{data.name}</li>
        <li>{data.content}</li>
        <li>{data.order}</li>
        </div>
      )}

      
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Name</label><br />
          <input onClick={(e) =>this.handleChange(e)} type="text" id="nameInput" />
        </div>
        <br />
        <div>
          <label>Content</label><br />
          <input onClick={(e) =>this.handleChange(e)} type="text" id="contentInput" />
        </div>
        <br />
          <div>
          <label>Order</label><br />
          <input onClick={(e) =>this.handleChange(e)} type="text" id="orderInput" />
        </div>
        <br />
        <input onClick={(e) =>this.handleChange(e)} type="submit" value="Submit"/>
        </form>
      </div>
    );
  }
}
export default App;
