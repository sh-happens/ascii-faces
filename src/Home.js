import React, { Component } from "react"
import Faces from "./Faces"
import env from "./Environment";
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1,
            pageSize: 20,
            totalProductCount: 0,
            products: [],
            buffer: [],
            randomAd : "",
            isLoading: true,
            sort: null,
            selectOptions: [
                { hiddenValue: null, visibleValue: "Select sorting option" },
                { hiddenValue: "price", visibleValue: "Price" },
                { hiddenValue: "id", visibleValue: "ID" },
                { hiddenValue: "size", visibleValue: "Size" }
            ]
        }
    }
    componentWillMount() {
        this.loadFirstFetch();
    }
    componentDidUpdate(){
   
        
    }
    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
    }
    trackScrolling = () => {
        let { pageNumber, buffer, products, isLoading,totalProductCount } = this.state;
        let userReachedBtm = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
        console.log(products.length);
        
        if (userReachedBtm && !isLoading && products.length <= totalProductCount) {
            console.log("scroll");
            console.log(buffer);
            this.setState({
                products: products.concat(buffer),
                pageNumber: pageNumber + 1,
            },()=>this.loadBuffer())
        }

    };
    loadBuffer() {  
        console.log("bunffer");
        this.setState({
            isLoading : true
        })
        fetch(this.endpointConstruct())
            .then(response => {
                return response.json()
            })
            .then(res => {
                this.setState({
                    isLoading : false
                })
                console.log("bufferring",buffer);
                let buffer = res.concat(this.fetchAds());
                this.setState({ buffer });
                window.scrollBy(0, -5);
            });
    }
    endpointConstruct(){
        let { pageNumber, pageSize, sort } = this.state;
        let baseUrl = env.baseUrl;
        let endpoint =   `${baseUrl}/products?_page=${pageNumber}&_limit=${pageSize}`;
        endpoint = sort !== null ? `${endpoint}&_sort=${sort}` : endpoint;
        
        return endpoint;
    }
    loadFirstFetch() {
        console.log("loadFirstFetch");
        let { pageNumber, pageSize } = this.state;
        fetch(this.endpointConstruct())
            .then(response => {
                this.setState({
                    totalProductCount: +response.headers.get('X-Total-Count')
                });
                return response.json()
            })
            .then(res => {
                let products = res.concat(this.fetchAds());           
                this.setState({ products, isLoading: false });
            }).then(() => {
                this.setState({ pageNumber: pageNumber + 1 },() => this.loadBuffer());
               
            });
    }
    handleOnChange(e){
        this.setState({
            products : [],
            buffer : [],
            isLoading : true,
            pageNumber : 1,
            sort : e.target.value
        },() => {
            this.loadFirstFetch();
        });

    }
    fetchAds() {
        const { randomAd } = this.state;
    
        let id = Math.floor(Math.random() * 1000);
    
        while (randomAd === id) {
          id = Math.floor(Math.random() * 1000);
        }
    
        this.setState({ randomAd: id });
    
        return { ad: id };
      }
    render() {
        let { products, selectOptions } = this.state;

        return (
            <div>
                <span>Sort by :</span>
                <select onChange={this.handleOnChange.bind(this)}>
                    {
                    selectOptions.map((selectOption) =>
                        <option key={selectOption.hiddenValue} value={selectOption.hiddenValue}>
                            {selectOption.visibleValue}
                        </option>
                    )
                    }
                </select>
                <Faces products={products}></Faces>
            </div>
        )
    }
}
export default Home;