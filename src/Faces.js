import React, { Component } from "react";
class Home extends Component {
    constructor(props) {
        super(props);
    }
    formatDate(date){
        let currentDate = new Date();
        console.log();
        let dateDiff = Math.round(( Date.parse(currentDate) - Date.parse(date) ) / (60 * 60 * 24 * 1000));
        if(dateDiff === 0){
            return "Today";
        }
        if(dateDiff < 6){
            let dayOrDays = dateDiff === 1 ? "day" : "days";
            return `${dateDiff} ${dayOrDays} ago`;
        }else{
            return new Date(date).toLocaleDateString("en-US");
        }    
    }
    formatPrice(cents){
        let dollars = cents/100;
        return `$${dollars}`;
    }
    render(){
        let {products} = this.props;
        return (
            <div>          
                {
                    products.map((product) => 
                    <div>
                        <span style={{fontSize:product.size}}>{product.face}</span>
                        <div>{this.formatPrice(product.price)}</div>
                        <div>{this.formatDate(product.date)}</div>
                        <hr/>
                    </div>
                    )
                }
            </div>
        )
    }
}
export default Home;