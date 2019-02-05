import React, { Component } from "react"
import Faces from "./Faces"
class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            pageNumber : 1,
            pageSize : 20,
            totalProductCount : 0,
            products :[],
            buffer : [],
            isLoading: true,
        }
    }
    componentWillMount() {
        this.loadFirstFetch();
    }
    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);
      }
      
      componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
      }
      trackScrolling = () => {
          let {pageNumber,buffer,products,isLoading} = this.state;
          let userReachedBtm = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
          if(userReachedBtm && !isLoading){
            console.log("scroll");
            console.log(window.scrollY);
            this.setState({
                products : products.concat(buffer),
                buffer : [],
                pageNumber : this.state.pageNumber + 1,
            })
            this.loadBuffer();
        }
     
      };
      loadBuffer(){
        console.log("bunffer");
        let {pageNumber, pageSize} = this.state;
        let baseUrl = 'http://localhost:3000';
        fetch(`${baseUrl}/products?_page=${pageNumber}&_limit=${pageSize}`)
      .then(response => {           
        return response.json()
      })
      .then(buffer => {       
        this.setState({ buffer});
        });
      }  
    loadFirstFetch(){
        console.log("loadFirstFetch");
        let {pageNumber, pageSize} = this.state;
        let baseUrl = 'http://localhost:3000';
        fetch(`${baseUrl}/products?_page=${pageNumber}&_limit=${pageSize}`)
      .then(response => {
        this.setState({
            totalProductCount : +response.headers.get('X-Total-Count')
        });      
        return response.json()
      })
      .then(products => {       
        this.setState({ products,isLoading : false});
        }).then(()=> {
            this.setState({pageNumber : pageNumber + 1});
            this.loadBuffer();
        });
    }
    render(){
        return (
            <div>
                <Faces products={this.state.products}></Faces>
            </div>
        )
    }
}
export default Home;