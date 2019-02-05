import React, { Component } from "react"
import Faces from "./Faces"
class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            pageNumber : 1,
            pageSize : 20,
            totalProductCount : 0,
            products :[]
        }
    }
    componentWillMount() {
        this.loadFirstFetch();
    }
    loadFirstFetch(){
        let {pageNumber, pageSize} = this.state;
        let baseUrl = 'http://localhost:3000';
        fetch(`${baseUrl}/products?_page=${pageNumber}&_limit=${pageSize}`)
      .then(response => response.json())
      .then(products => {
          
        this.setState({ products })
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