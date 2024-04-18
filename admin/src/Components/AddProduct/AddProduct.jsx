import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'
import { useState } from 'react'

const AddProduct = () => {
    

const[image, setImage]=useState(false);
const[productDetails, setProductDetail]=useState({
    name:"",
    image:"",
    category:"women"
    ,old_price:"",
    new_price:""

})
const imageHandler=(e)=>{
setImage(e.target.files[0])
}

const changeHandler=(e)=>{
setProductDetail({...productDetails,[e.target.name]:e.target.value})
}
// function for add button 
const Add_Product = async () => {
    console.log(productDetails);

    // linking with backend 
    let responseData;
    let product = productDetails;
    let formData = new FormData();
    formData.append('product', image);

    try {
        // sending formdata to api
        const response = await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        responseData = await response.json();

        if (responseData.success) {
            product.image = responseData.image_url;
            console.log(product);
            //sending this data to addproduct endpoint using fetch api
            await fetch("http://localhost:4000/addproduct",{
                method:'POST',
                headers:{
                    Accept: 'application/json',
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(product),
            }).then((resp)=>resp.json()).then((data)=>{
                data.success?alert("Product Added"):alert("Failed")
            })
        } else {
            console.error('Upload failed:', responseData.message);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}



  return (
    <div className='add-product'>
        <div className="addproduct-itemfield">
            <p> Product Title</p>
            <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder='Type here' />
        </div>
        <div className="addproduct-price">
            <div className="addproduct-itemfield">
                <p>Price</p>
                <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type here' />
            </div>
            <div className="addproduct-itemfield">
                <p>Offer Price</p>
                <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder='Type here' />
            </div>
        </div>
        <div className="addproduct-itemfield">
            <p>Product Category</p>
            <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kids">Kids</option>
            </select>
        </div>
        <div className="addproduct-itemfield">
            <label htmlFor="file-input">
                <img src={image?URL.createObjectURL(image):upload_area} alt="" className='addproduct-thumnail-img' />
            </label>
            <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
        </div>
        <button onClick={()=>{
            Add_Product()
        }} className='addproduct-btn'>Add</button>
    </div>
  )
}

export default AddProduct