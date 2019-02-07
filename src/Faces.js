import React, { Component } from "react";
import env from "./Environment";
import LoadingDots from "./LoadingDots";
class Home extends Component {

    formatDate(date){
        let currentDate = new Date();
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
        let {products,totalProductCount,isLoading,pageSize} = this.props;
        let baseUrl = env.baseUrl;
        let displayArray = []
        let hasMore = products.length >= (totalProductCount + (totalProductCount/pageSize));
        displayArray.push(products.map((product) => {                
            if(product.hasOwnProperty('rid')){
                return (
                <div className="card">
                    <img alt="" className="ad" src={`${baseUrl}/ads/?r=${product.rid}`}/>
                    <div className="card-body">
                        <h1>Advertisement</h1>
                        <div>We are a tech company.We got all sort of products & gadgets </div>
                    </div>
                </div>
                )
            }
            return (
                <div className="card">
                    <span style={{fontSize:product.size}}>{product.face}</span>
                    <div className="card-body">
                        <div>{this.formatPrice(product.price)}</div>
                        <div>{this.formatDate(product.date)}</div>
                    </div>
                </div>
            )        
        }) )
        if(isLoading){
            displayArray.push(<LoadingDots/>)
        }
        if(hasMore && products.length !== 0){
            displayArray.push(<div>~ end of catalogue ~</div>)
        }
        return displayArray;                       
            
        
        
        
    }
}
export default Home;