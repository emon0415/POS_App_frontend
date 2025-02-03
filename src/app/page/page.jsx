"use client";
import React, { useState } from "react";


const Page = () => {
    const [code, setCode] = useState("");//商品コード
    const [error, setError] = useState<string | null>(null);//エラーメッセージ
    const [productName, setProductName] = useState("");//商品名
    const [productPrice, setProductPrice] = useState<number | null>(null);//単価

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;


    // 商品コード読み込みボタン
    const fetchProductInfo = async () =>{
        try {
            setError(null);//エラーリセット
            const response = await fetch(`${apiUrl}/products/${code}`,{
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();// バックエンドからのレスポンスを取得
            setProductName(data.name);//商品名セット
            setProductPrice(data.price);//単価セット
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
            {error && <p style = {{color: "red" }}>{error}</p>}
            {productName && (
                <div>
                    <h2>Product Information</h2>
                    <h2>Name: {productName}</h2>
                    <p>Price: {productPrice !== null ? `${productPrice}円` : "N/A"}</p>
                </div>
            )}
        </div>
    );
};

export default Page;