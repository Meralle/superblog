import React from 'react';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      posts: [],
      form:{},
      editing:null

    }
  }
  componentWillMount(){
    fetch(`http://localhost:5000/api/posts`)
    .then(response => {
      return response.json();
    })
    .then(posts => {
      console.log(posts);
      this.setState({posts : posts})

    })
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    
  }

   handleSubmit(e) {
   e.preventDefault();
   console.log(e)
   let addPostForm = this.state.form;
   axios.post(`http://localhost:5000/api/posts`, addPostForm).then(response => {
     console.log("Slide added successful: ", response);
       fetch(`http://localhost:5000/api/posts`).then( resp => resp.json()).then(posts => {
         this.setState({posts: posts});
     });
   }).catch(function(error){
     console.log("Errooooor: ", error);
   })
 }
      

  handleChange(e){
    e.preventDefault();
    // console.log(e)
  let sendPost = {...this.state.form}
   sendPost[e.target.id]=e.target.value;
   this.setState({form : sendPost});
  }

  handleDelete(id) {
    console.log(id);
    axios.delete(`http://localhost:5000/api/posts/${id}`).then(response => {
    console.log("Slide deleted successful: ", response);
    fetch(`http://localhost:5000/api/posts`)
    .then(response => response.json())
    .then(posts => {
      this.setState({posts : posts});
      M.toast({html: 'Post delete successfully!'})
    });
  }).catch(function(error){
    console.log("Error: ", error);
  })

}

handleUpdate(event, post){
  event.preventDefault()
  axios.put(`http://localhost:5000/api/posts/${id}` , this.state.form).then(response => {
    console.log("Slide edited successful: " , response);
    fetch(`http://localhost:5000/api/posts`).then(response.json())
    .then(posts => {
      this.setState({posts : posts, editing: null});
        M.toast({html: 'Post updated successfully!'})
    });
  }).catch(function(error){
    console.log("Error: ", error);
  })

}

handleEdit(post) {
  this.setState({
    from:post,
    editing: post
  })
}

  render() {
      const posttemplate = this.state.posts.map((post,i)=> 
        this.state.editing && this.state.editing._id === post._id ? (
          <form key={i} onSubmit={(event) => this.handleUpdate(event, post)}>
            <div className="form-group">
              <label className="w-100">
              Name
              <input className="materialize-textarea" defaultValue={this.state.editing.name} onChange={this.handleChange} type="textarea" id="name" />
              </label>
            </div>
              
            <div className="form-group">
              <label className="w-100">
              Content
              <input   className="materialize-textarea" defaultValue={this.state.editing.content} onChange={this.handleChange} type="textarea" id="content" />
              </label>
            </div>
            
            <div className="form-group">                       
              <label className="w-100">
              Order
              <input className="materialize-textarea" onChange={this.handleChange} type="textarea" id="order" />
              </label>
            </div>

            <div className="form-group">
              <button className="btn btn-primary" type="submit">Submit</button>
            </div>
            </form>
          ) : (
              <li className="list-group-item" key={i}>
                <h2>{post.name}</h2>
                <p>{post.content}</p>
                <p>{post.order}</p>
             {/*   <button className="btn btn-info" onClick={() => this.handleEdit(post)}>Edit</button>*/}
              <a class="btn-floating btn-large waves-effect waves-light red" onClick={() => this.handleEdit(post)}><i class="material-icons">add</i></a>
                <button className="btn btn-danger" onClick={() => this.handleDelete(post._id)}>Remove</button>
              </li>
            )
        )
      return (
      <div className="container">
       <div className="my-3">
       <h2>Create a Post:</h2>  
          
           
         <form  id="form" onSubmit={this.handleSubmit}>
           <div className="form-group">  
             <label>Name: </label>    
               <input  className="form-control" type="textarea" onChange={this.handleChange} id="name" />
           </div>    
               <br />
           <div className="form-group">    
             <label>Content: </label>  
               <input  className="form-control" type="textarea" onChange={this.handleChange} id="content"  />
           </div>    
               <br />
           <div className="form-group">    
             <label>Order: </label>  
               <input  className="form-control" type="number" onChange={this.handleChange} id="order" />
           </div>    
            <button className="btn waves-effect waves-light" type="submit">Submit <i class="material-icons right">send</i></button>
               
         </form>
         </div>
          <div className="my-3">
            <h2>list of all posts:</h2>
            <ul className="list-group">
               {posttemplate}
            </ul>  
          </div>
        </div>

     
   );
 }
}
export default App;

