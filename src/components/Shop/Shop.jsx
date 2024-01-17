import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);

    const carts = useLoaderData()

    const [cart, setCart] = useState(carts);


    // pagination state
    const [itemsPerPage, setItemsPerPage] = useState(10)

    // current page state
    const [currentPage, setCurrentPage] = useState(0);

    // from the loader get all number of counted products
    // const { count } = useLoaderData();

    const [count, setCount] = useState(0)

    // const itemsPerPage = 10;
    const numberOfPages = Math.ceil(count / itemsPerPage);

    // a way to find pages number. using for loop
    // const pages = [];
    // for (let i = 0; i < numberOfPages; i++){
    //     pages.push(i)
    // }
    // console.log(pages)

    // using array
    const pages = [...Array(numberOfPages).keys()]
    console.log("Total pages:", pages)



    useEffect(() => {
        fetch('https://ema-john-pagination-server-starter-kyntkwjf2-triistiak-gmailcom.vercel.app/productCount')
            .then(res => res.json())
        .then(data => setCount(data.count))
    }, [])

    useEffect(() => {
        fetch(`https://ema-john-pagination-server-starter-kyntkwjf2-triistiak-gmailcom.vercel.app/products?page=${currentPage}&size=${itemsPerPage}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentPage, itemsPerPage]);

    // useEffect(() => {
    //     const storedCart = getShoppingCart();
    //     const savedCart = [];
    //     // step 1: get id of the addedProduct
    //     for (const id in storedCart) {
    //         // step 2: get product from products state by using id
    //         const addedProduct = products.find(product => product._id === id)
    //         if (addedProduct) {
    //             // step 3: add quantity
    //             const quantity = storedCart[id];
    //             addedProduct.quantity = quantity;
    //             // step 4: add the added product to the saved cart
    //             savedCart.push(addedProduct);
    //         }
    //         // console.log('added Product', addedProduct)
    //     }
    //     // step 5: set the cart
    //     setCart(savedCart);
    // }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    // product per page handler
    const handleChangeItemPerPage = event => {
        const perPageValue = parseInt(event.target.value)
        console.log('page:', perPageValue);
        setItemsPerPage(perPageValue);
        // console.log('Items per page:', itemsPerPage)

        // if we select number of page from selector then the current page should be 0. So we need to set current page 0 while clicking the selector.
        setCurrentPage(0);
    }

    // 
    const handlePrevButton = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    }
    
    const handleNextButton = () => {
        if (currentPage <  pages.length - 1) {
            setCurrentPage(currentPage + 1);
            console.log('current Page:',currentPage)
        }
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>

            <div className='pagination'>

                <h3>current page: {currentPage}</h3>
                
                <button onClick={handlePrevButton}>Prev</button>

                {
                    pages.map(page => <button
                        className={currentPage === page ? 'selected' : undefined}
                        onClick={() => setCurrentPage(page)}
                        key={page}
                    >{page}</button>)
                }

                <button onClick={handleNextButton}>Next</button>


                {/* how many page should we display in a page */}
                <div>
                    <select name="" id="" value={itemsPerPage} onChange={handleChangeItemPerPage}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>

            </div>

        </div>
    );
};

export default Shop;