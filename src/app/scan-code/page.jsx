"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ScanCode = () => {
    const [code, setCode] = useState("");//商品コード
    const [error, setError] = useState(null);//エラーメッセージ
    const [productName, setProductName] = useState("");//商品名
    const [productPrice, setProductPrice] = useState(null);//単価
    const [cart, setCart] = useState([]);// 購入リスト
    const [totalPrice, setTotalPrice] = useState(0);//合計金額]

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    // クエリパラメータから取得
    const [empCd, setEmpCd] = useState("");
    const [storeCd, setStoreCd] = useState("");
    const [posNo, setPosNo] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        setEmpCd(queryParams.get("empCd") || "");
        setStoreCd(queryParams.get("storeCd") || "");
        setPosNo(queryParams.get("posNo") || "");
    }, []);

    useEffect(() => {
        // cartが更新されるたびに合計金額を計算
        setTotalPrice(cart.reduce((acc,item) => acc + parseInt(item.price, 10), 0));
    }, [cart]);

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
            setProductName(data.name || "");//商品名セット
            setProductPrice(data.price || "");//単価セット
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
            setTotalPrice(cart.reduce((acc, item) => acc + item.price, 0));
            setProductName("");
            setProductPrice(null);
        }
    };

    const clearCart = () => {
        setCart([]);
        setTotalPrice(0);
    }

    const handlePurchase = () => {
        if (cart.length == 0) {
            alert("購入リストがありません");
            return;
        }
        alert(`合計金額: ${totalPrice}円`);
        clearCart();
    };

    const handleGoBack = () => {
        // new-transaction ページに戻る
        router.push("/new-transaction");
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
            <div>
                <h2 style={{ margin: 0, color: "#333" }}>新規取引情報</h2>
                <p>レジ担当者コード: {empCd}</p>
                <p>店舗コード: {storeCd}</p>
                <p>POS機ID: {posNo}</p>
            </div>

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
                <h2> {productName || ""}</h2>
                <p> {productPrice !== null ? `${productPrice}円` : ""}</p>
                <button 
                    onClick={addToCart} 
                    className="animate-rainbow"
                    style={{ 
                        padding: "10px 20px",
                        fontSize: "16px",
                        color: "white",
                        backgroundColor: "#28A745",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer", 
                        }}
                >
                    追加
                </button>
            </div>
            
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
                <p style={{ fontWeight: "bold" }}>合計金額: {totalPrice}円</p>
                <button 
                    onClick={handlePurchase}
                    className="animate-blink" 
                    style={{ 
                        marginTop: "10px", 
                        padding: "10px 20px", 
                        fontSize: "16px", 
                        cursor: "pointer", 
                        backgroundColor: "#FF5722",
                        color: "white", 
                        border: "none", 
                        borderRadius: "5px" 
                        }}
                >
                    購入
                </button>
                <button
                    onClick={clearCart}
                    style={{
                        marginTop: "10px", 
                        padding: "10px 20px", 
                        fontSize: "16px", 
                        cursor: "pointer", 
                        backgroundColor: "#FF0000",
                        color: "white", 
                        border: "none", 
                        borderRadius: "5px" 
    
                    }}
                >
                    リセット
                </button>
            </div>
            <button
                onClick={handleGoBack}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#6C757D",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                TOP画面に戻る
            </button>
        </div>
    );
};

export default ScanCode;