"use client";
import React, { useState } from "react";


const Page = () => {
    const [code, setCode] = useState("");//商品コード
    const [error, setError] = useState(null);//エラーメッセージ
    const [productName, setProductName] = useState("");//商品名
    const [productPrice, setProductPrice] = useState(null);//単価

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;


    // 商品コード読み込みボタン
    const fetchProductInfo = async () =>{
        try {
            setError("");//エラーリセット
            if (!code.trim()){
                throw new Error("商品コードを入力してください");
            }
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
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);//エラーメッセージセット
            }else {
                setError("予期しないエラーが発生しました");
            }
        }
    };


    return (
        <div>
            <h1>Product Code Input</h1>
            <input 
                type="text" 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                placeholder="商品コードを入力してください"
            />
            <button onClick={fetchProductInfo}>
                商品コード読み込み
            </button>
            {error && <p style = {{color: "red" }}>{error}</p>}
            {productName && (
                <div>
                    <h2>名前: {productName}</h2>
                    <p>値段: {productPrice !== null ? `${productPrice}円` : "N/A"}</p>
                </div>
            )}
        </div>
    );
};

export default Page;