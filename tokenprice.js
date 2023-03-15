let pancakeSwapAbi =  [
{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},
];
let tokenAbi = [
{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
];
const Web3 = require('web3');

const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //BNB	 
const BSTTTokenAddress = "0x7AF490918ECac4b7360791cAb3dF91525D3AFc62" //BSTT      change to your token address
const USDTokenAddress  = "0x55d398326f99059fF775485246999027B3197955" //USDT



let pancakeSwapContract = "0x10ED43C718714eb63d5aA57B78B54704E256024E".toLowerCase();
const web3 = new Web3("https://bsc-dataseed1.binance.org");
async function calcSell( tokensToSell, tokenAddres){

    const web3 = new Web3("https://bsc-dataseed1.binance.org");
	
    let tokenRouter = await new web3.eth.Contract( tokenAbi, tokenAddres );
    let tokenDecimals = await tokenRouter.methods.decimals().call();
    
    tokensToSell = setDecimals(tokensToSell, tokenDecimals);
    let amountOut;
    try {
        let router = await new web3.eth.Contract( pancakeSwapAbi, pancakeSwapContract );
        amountOut = await router.methods.getAmountsOut(tokensToSell, [tokenAddres ,BNBTokenAddress]).call();
        amountOut =  web3.utils.fromWei(amountOut[1]);
    } catch (error) {}
    
    if(!amountOut) return 0;
    return amountOut;
}

async function calcBSTTPrice(){
    const web3 = new Web3("https://bsc-dataseed1.binance.org");
    
	
    let bnbToSell = web3.utils.toWei("1", "ether") ;
    let amountOut;
    try {
        let router = await new web3.eth.Contract( pancakeSwapAbi, pancakeSwapContract );

        amountOut = await router.methods.getAmountsOut(bnbToSell, [BSTTTokenAddress ,BNBTokenAddress]).call();
        amountOut =  web3.utils.fromWei(amountOut[1]);
    } catch (error) {}
    if(!amountOut) return 0;
    return amountOut;
}


async function calcBNBPrice(){
    const web3 = new Web3("https://bsc-dataseed1.binance.org");
 
    let bnbToSell = web3.utils.toWei("1", "ether") ;
    let amountOut;
    try {
        let router = await new web3.eth.Contract( pancakeSwapAbi, pancakeSwapContract );
        
        amountOut = await router.methods.getAmountsOut(bnbToSell, [BNBTokenAddress ,USDTokenAddress]).call();
        amountOut =  web3.utils.fromWei(amountOut[1]);
    } catch (error) {}
    if(!amountOut) return 0;
    return amountOut;
}
function setDecimals( number, decimals ){
    number = number.toString();
    let numberAbs = number.split('.')[0]
    let numberDecimals = number.split('.')[1] ? number.split('.')[1] : '';
    while( numberDecimals.length < decimals ){
        numberDecimals += "0";
    }
    return numberAbs + numberDecimals;
}

async function BSTTprice ()
{
    

    let bnbPrice = await calcBNBPrice() // query pancakeswap to get the price of BNB in USDT
	let bsttPrice = await calcBSTTPrice() // query pancakeswap to get the price of BSTT in BNB
	let bsttprice = bsttPrice * bnbPrice;

document.getElementById("bsttprice").innerHTML  = bsttprice.toFixed(10) ;


setTimeout(function() {
   BSTTprice();

  
}, 3000);


}

BSTTprice();


