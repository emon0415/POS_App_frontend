"use client";
import React, { useState } from "react";


const Page = () => {
    const [code, setCode] = useState("");//商品コード
    const [error, setError] = useState(null);//エラーメッセージ
    const [productName, setProductName] = useState("");//商品名
    const [productPrice, setProductPrice] = useState(null);//単価
    const [cart, setCart] = useState([]);// 購入リスト

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

    const addToCart = () => {
        if (productName && productPrice) {
            setCart([...cart, {name: productName, price: productPrice}]);
            setProductName("");
            setProductPrice(null);
        }
    };


    return (
        <div 
            style={{ 
                backgroundColor: "#f2f2f2",
                minHeight: "100vh",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px" 
                }}
        >
            <div 
                style={{ 
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px" ,
                    border: "1px solid #ddd",
                    padding: "10px",
                    borderRadius: "5px"
                    }}
            >
                <input 
                    type="text" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    placeholder="商品コードを入力してください"
                    style={{ 
                        padding: "10px",
                        fontSize: "16px" ,
                        width: "200px",
                        border: "1px solid #ccc", 
                        borderRadius: "5px", 
                        color: "#000", 
                        backgroundColor: "#fff"
                    }}
                />
                <button 
                    onClick={fetchProductInfo} 
                    style={{ 
                        padding: "10px 20px", 
                        fontSize: "16px", 
                        backgroundColor: "#007BFF", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "5px", 
                        cursor: "pointer" 
                        }}
                >
                    商品コード読み込み
                </button>
            </div>
            {error && <p style = {{color: "red" }}>{error}</p>}
            {productName && (
                <div 
                    style={{ 
                        textAlign: "center" , 
                        border: "1px solid #ddd", 
                        padding: "10px", 
                        borderRadius: "5px", 
                        width: "300px", 
                        backgroundColor: "#fff" 
                        }}
                >
                    <h2>名前: {productName}</h2>
                    <p>値段: {productPrice !== null ? `${productPrice}円` : "N/A"}</p>
                    <button onClick={addToCart} 
                        className="animate-rainbow"
                        style={{ 
                            padding: "10px 20px",
                            fontSize: "16px",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer", 
                            }}
                    >
                        追加
                    </button>
                </div>
            )}
            <div 
                style={{ 
                    width: "400px", 
                    border: "1px solid #ddd", 
                    padding: "10px", 
                    borderRadius: "5px", 
                    backgroundColor: "#fff" 
                    }}
            >
                <h2>購入リスト</h2>
                <ul>
                    {cart.map((item, index) => (
                        <li key={index} style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>{item.name}</span>
                            <span>{item.price}円</span>
                        </li>
                    ))}
                </ul>
                <button 
                    className="animate-blink" 
                    style={{ 
                        marginTop: "10px", 
                        padding: "10px 20px", 
                        fontSize: "16px", 
                        cursor: "pointer" 
                        }}
                >
                    購入
                </button>
            </div>
        </div>
    );
};

export default Page;