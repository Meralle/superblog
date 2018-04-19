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
 //   axios.post(`http://localhost:5000/api/posts`, addPostForm).then(response => {
 //     console.log("Slide added successful: ", response);
 //       fetch(`http://localhost:5000/api/posts`).then( resp => resp.json()).then(posts => {
 //         this.setState({posts: posts});
 //          M.toast({html: 'Post submit successfully!'})
 //     });
 //   }).catch(function(error){
 //     console.log("Errooooor: ", error);
 //   })
 // }
     fetch("http://localhost:5000/api/posts", {
        method: "POST",
        body: JSON.stringify(addPostForm),
        headers: {
           "contenttype": "application/json"
         }
       }).then(response => response.json())
       .then(response => {
         console.log(response)
         let posts = {...this.state.posts}
         let posts_array = []
         for (let key in posts) {
           if (posts.hasOwnProperty(key)) {
             posts_array.push(posts[key])
           }
         }
         posts_array.push(response.post)
         this.setState({posts: posts_array});
       });

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
  axios.put(`http://localhost:5000/api/posts/${post._id}`,this.state.form).then(response => {
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
      const style = {
        style1:{
          display:"none"
        },
        margin:"0 1rem",
      }


      const posttemplate = this.state.posts.map((post,i)=> 
        this.state.editing && this.state.editing._id === post._id ? (
          <form key={i} onSubmit={(event) => this.handleUpdate(event, post)}>
            <div className="form-group">
              <label className="w-100">
              Name
              <input className="input-field col s6" defaultValue={this.state.editing.name} onChange={this.handleChange} type="text" id="name" />
              </label>
            </div> 
           
            <div>
              <label className="w-100">
              Content
              <input   className="input-field col s6" defaultValue={this.state.editing.content} onChange={this.handleChange} type="text" id="content" />
              </label>
            </div>
            
            <div>                      
              <label className="w-100">
              Order
              <input className="input-field col s6" onChange={this.handleChange} type="text" id="order" />
              </label>
            </div>

            <div className="form-group">
              <button className="btn waves-effect waves-light" type="submit">Submit <i className="material-icons right">send</i></button>
            </div>
            </form>
          ) : (
              <li className="list-group-item" key={i}>
                <h4 className="mt-0">{post.name}</h4>
                <p>{post.content}</p>
                <p>{post.order}</p>
                <button style={style} className="btn-floating btn-large waves-effect waves-light red"  onClick={() => this.handleEdit(post)}><i className="material-icons create">create</i></button>
                <button style={style} className="btn-floating btn-large waves-effect waves-light red" onClick={() => this.handleDelete(post._id)}><i className="material-icons clear">clear</i></button>
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
               <input  className="form-control" type="text" onChange={this.handleChange} id="name" />
           </div>    
               <br />
           <div className="form-group">    
             <label>Content: </label>  
               <input  className="form-control" type="text" onChange={this.handleChange} id="content"  />
           </div>    
               <br />
           <div className="form-group">    
             <label>Order: </label>  
               <input  className="form-control" type="number" onChange={this.handleChange} id="order" />
           </div>    
            <button className="btn waves-effect waves-light" type="submit">Submit <i className="material-icons right">send</i></button>
               
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

