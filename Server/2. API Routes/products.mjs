import express from 'express';

const products = express();
const PORT = 4000;

let Allproducts = [
    {
        name: 'car',
        id:1,

    },
    {
        name: 'bike',
        id:2,
        
    },
    {
        name: 'bus',
        id:3,
        
    },
    {
        name: 'truck',
        id:4,
        
    }
]



products.get('/', (req,res)=>{
    console.log('products api')
    res.send(Allproducts);
})
// params
products.get('/:id', (req,res)=>{
    console.log('products api')
    let id = req.params.id;
    let product = Allproducts.filter((product)=>product.id == id);
    if(product.length === 0){
        return res.status(404).send({message: 'Product not found'});
    }       
    res.send(product);
})



export default products; 