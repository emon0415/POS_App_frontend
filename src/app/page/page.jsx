"use client";
import React, { useState } from "react";


const Page = () => {
    const [code, setCode] = useState("");//商品コード
    const [error, setError] = useState(null);//エラーメッセージ
    const [productName, setProductName] = useState("");//商品名
    const [productPrice, setProductPrice] = useState("");//単価

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;


    // 商品コード読み込みボタン
    const fetchProductInfo = async () =>{
        try {
            setError(null);//エラーリセット
            const response = await fetch(`${apiUrl}/fetch-product-info`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productCode: code,
                }),//商品コードを送信
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();// バックエンドからのレスポンスを取得
            setProductName(data.productName);//商品名セット
            setProductPrice(data.productPrice);//単価セット
        }catch (err) {
            setError(err.message);//エラーメッセージセット
        }
    };


    return (
        <div>
            <h1>Product Code Input</h1>
            <input 
                type="text" 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                placeholder="Enter product code"
            />
            <button onClick={fetchProductInfo}>
                Fetch Product Code
            </button>
            {error && <p>{error}</p>}
            {productName && (
                <div>
                    <h2>Product Infomation</h2>
                    <h2>Name: {productName}</h2>
                    <p>Price: {productPrice}</p>
                </div>
            )}
        </div>
    );
};

export default Page;