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
    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
    }
    trackScrolling = () => {
        let { pageNumber, buffer, products, isLoading } = this.state;
        let userReachedBtm = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
        if (userReachedBtm && !isLoading) {
            console.log("scroll");
            console.log(window.scrollY);
            this.setState({
                products: products.concat(buffer),
                buffer: [],
                pageNumber: this.state.pageNumber + 1,
            })
            this.loadBuffer();
        }

    };
    loadBuffer() {
        console.log("bunffer");
        fetch(this.endpointConstruct())
            .then(response => {
                return response.json()
            })
            .then(buffer => {
                this.setState({ buffer });
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
            .then(products => {
                this.setState({ products, isLoading: false });
            }).then(() => {
                this.setState({ pageNumber: pageNumber + 1 });
                this.loadBuffer();
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
    render() {
        let { products, selectOptions } = this.state;
        return (
            <div>
                <span>Sort by :</span>
                <select onChange={this.handleOnChange.bind(this)}>
                    {
                    selectOptions.map((selectOption) =>
                        <option value={selectOption.hiddenValue}>
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