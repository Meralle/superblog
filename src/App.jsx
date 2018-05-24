
import React from 'react';
import axios from 'axios';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      posts: [],
      form:{},
      editing:null,
      searchFilter: ""

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
    this.handleSearchInput = this.handleSearchInput.bind(this)
    this.handleSorting = this.handleSorting.bind(this);
    
  }

   handleSubmit(e) {
   e.preventDefault();
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
           "content-type": "application/json"
         }
       }).then(response => response.json())
       .then(response => {
          console.log(response)
          let posts = [...this.state.posts]
          posts.push(response.post)
          this.setState({posts:posts, form:{name: "", content:"", order:""}});
          M.toast({html: 'Post submit successfully!'})
       });

  }

    handleChange(e){
      e.preventDefault(); 
      let sendPost = {...this.state.form}
      sendPost[e.target.id]=e.target.value;
      this.setState({form : sendPost });
  } 
    //   axios.delete(`http://localhost:5000/api/posts/${id}`).then(response => {
    //   console.log("Slide deleted successful: ", response);
    //   fetch(`http://localhost:5000/api/posts`)
    //   .then(response => response.json())
    //   .then(posts => {
    //     this.setState({posts : posts});
    //     M.toast({html: 'Post delete successfully!'})
    //   });
    // }).catch(function(error){
    //   console.log("Error: ", error);
    // })

    handleDelete(id) {
      let form = {...this.state.form};
      fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'DELETE',
        body: JSON.stringify(form),
        headers: {
          'content-type': 'application/json'
        }

      }).then(response => {
        console.log("response: ", response);
        fetch(`http://localhost:5000/api/posts`)
        .then(resp => resp.json())
        .then(posts => {
        this.setState({posts: posts});
        });
        }).catch(function(error) {
        console.log("Error: ", error);
        })
  }

    // handleUpdate(event, post){
    //   event.preventDefault()
    //   axios.put(`http://localhost:5000/api/posts/${post._id}`,this.state.form).then(response => {
    //     console.log("Slide edited successful: " , response);
    //     fetch(`http://localhost:5000/api/posts`).then(response.json())
    //     .then(posts => {
    //       this.setState({posts : posts, editing: null});
    //         M.toast({html: 'Post updated successfully!'})
    //     });
    //   }).catch(function(error){
    //     console.log("Error: ", error);
    //   })

    // }

    handleUpdate(event, post) {
        event.preventDefault();
        let form = this.state.form;
        let posts = [...this.state.posts];
        console.log(posts);
        fetch(`http://localhost:5000/api/posts/${post._id}`, {
          method: 'PUT',
          body: JSON.stringify(form),
          headers: {
            'content-type': 'application/json'
          }
        })
        .then(response => {
          fetch('http://localhost:5000/api/posts')
          .then(resp => resp.json())
          .then(posts => {
            this.setState({posts: posts});
          });
          console.log(post);
          this.setState({posts: posts, editing: null})

        }).catch(function(error) {
          console.log("ERROR:", error);

        })
  }

    handleEdit(post) {
      this.setState({
        from:post,
        editing: post
      })
  }

    handleSorting(){
      let order = this.state.posts.sort((a,b) => a.order - b.order)
      this.setState({posts: order})
  }
    handleSearchInput(e)  {            
      let searchFilter = e.currentTarget.value;
      this.setState({ searchFilter: searchFilter});      
}
    render() {
      
      let posts = [...this.state.posts]
      posts = posts.filter( i => i.name.toLowerCase().includes(this.state.searchFilter.toLowerCase()))
      const posttemplate = posts.map((post,i)=> 
        this.state.editing && this.state.editing._id === post._id ? (
          <form key={i} onSubmit={(event) => this.handleUpdate(event, post)}>
            <div className="input-field col s6">
              <label> Name</label>
              <input className="form-control"  defaultValue={this.state.editing.name}  onChange={this.handleChange} type="text" id="name" />
              
            </div> 
           
            <div className="input-field col s6">
              <label className="">
              Content
               </label>
              <input className="form-control" defaultValue={this.state.editing.content} onChange={this.handleChange} type="text" id="content" />
             
            </div>
            
            <div className="input-field col s6">                      
              <label className="">
              Order
               </label>
              <input className="form-control" defaultValue={this.state.editing.order}  onChange={this.handleChange} type="text" id="order" />
             
            </div>

            <div className="input-field col s6">
              <button className="btn waves-effect waves-light" type="submit">Submit <i className="material-icons right">send</i></button>
            </div>
            </form>
          ) : (
              <li className="list-group-item  mb-3 z-depth-1 hoverable" key={i}><br/>
                <button className="btn-floating btn-small waves-effect waves-light waves-light right z-depth-0 "  onClick={() => this.handleEdit(post)}><i className="material-icons create">create</i></button>
                <button className="btn-floating btn-small waves-effect waves-light red right z-depth-0 " onClick={() => this.handleDelete(post._id)}><i className="material-icons clear">clear</i></button>
                <h5 className="thin condensed">{post.name}</h5>
                <h5>{post.content}</h5>
                <p>{post.order}</p>
              </li>
            )
        )
      return (
      <div className="container">
       <div className="my-3">
       <br />
        <div className="input-field col s12">
            <input id="title" type="text" placeholder="search" onChange={this.handleSearchInput} value={this.state.searchFilter} />
        </div>
       <h2>Create a Post:</h2>  
         <form  id="form" onSubmit={this.handleSubmit}>
           <div className="form-group">  
             <label>Name: </label>    
               <input  className="form-control" defaultValue={this.state.form.name} type="text" onChange={this.handleChange} id="name" />
           </div>    
               <br />
           <div className="form-group">    
             <label>Content: </label>  
               <input  className="form-control" defaultValue={this.state.form.content} type="text" onChange={this.handleChange} id="content"  />
           </div>    
               <br />
           <div className="form-group">    
             <label>Order: </label>  
               <input  className="form-control" defaultValue={this.state.form.order} type="number" onChange={this.handleChange} id="order" />
           </div>    
            <button className="btn waves-effect waves-light" type="submit">Submit <i className="material-icons right">send</i></button>
               
         </form>
         </div>
          <div className="my-3"> 
            <h2>list of all posts:<button className="btn-floating btn-large waves-effect waves-light" onClick={this.handleSorting}><i className="material-icons expand_less expand_more">expand_less  expand_more</i></button></h2>
            <ul className="list-group">
               {posttemplate}

            </ul>  
          </div>
           <footer className="small text-muted mb-5">&copy; 2018 Meralle Halablyan</footer>
        </div>

     
   );
 }
}
export default App;

 
