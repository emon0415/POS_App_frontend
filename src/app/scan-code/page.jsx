"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Quagga from 'quagga';

const ScanCode = () => {
    const [code, setCode] = useState("");//商品コード
    const [error, setError] = useState(null);//エラーメッセージ
    const [productName, setProductName] = useState("");//商品名
    const [productPrice, setProductPrice] = useState(null);//単価
    const [cart, setCart] = useState([]);// 購入リスト
    const [totalPrice, setTotalPrice] = useState(0);//合計金額]
    const [isScanning, setIsScanning] = useState(false); // スキャン状態の管理

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    // TOPページで入力した情報をURLに記載されているクエリパラメータから取得
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
        // cartが更新されるたびに合計金額を計算する
        setTotalPrice(cart.reduce((acc,item) => acc + parseInt(item.price, 10), 0));
    }, [cart]);

    // APIリクエストのエラーハンドリングを統一
    const handleErrors = async (response) => {
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        return response.json();
    };

    // 取引を登録する関数
    const fetchTransaction = async (totalPrice) => {
        try{
            console.log("取引登録リクエスト開始"); // デバッグログ
            const response = await fetch(`${apiUrl}/add_transaction`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    EMP_CD: empCd,
                    STORE_CD: storeCd,
                    POS_NO: posNo,
                    TOTAL_AMT: totalPrice,
                }),
            });

            console.log("取引登録レスポンス:", response); // レスポンス全体をログ

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const transactionData = await response.json();
            console.log("取引登録レスポンスデータ:", transactionData); // JSONレスポンスをログ

            if (!transactionData.TRD_ID) {
                throw new Error("取引登録に失敗しました。サーバーからの適切なレスポンスがありません。");
            }

            // TTL_AMT_EX_TAX を取得
            const taxExcludedAmount = transactionData.TTL_AMT_EX_TAX;
            console.log("税抜合計金額:", taxExcludedAmount);

            return { trdId: transactionData.TRD_ID, taxExcludedAmount }; // TRD_IDと税抜価格を返す
        } catch (error) {
            console.error("取引登録エラー:", error);
            throw error;
        }
    };

    // 取引詳細を登録する関数
    const fetchTransactionDetails = async (trdId) => {
        try{
            for (const item of cart){
                // MISSING のデータは送信しない
                if (!item.PRD_CODE || item.PRD_CODE === "MISSING") {
                    console.warn("スキップ: 不正な商品コード", item);
                    continue;
                }

                const requestData = {
                    TRD_ID: trdId,
                    PRD_CODE: item.PRD_CODE || "MISSING",
                    PRD_NAME: item.name || "MISSING",
                    PRD_PRICE: item.price || 0,
                };
                console.log("送信データ:", requestData);

                const response = await fetch(`${apiUrl}/add_transaction_detail`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestData),
                });
                await handleErrors(response);
            }

            alert("取引詳細が登録されました");
        } catch (err) {
            console.error("取引詳細登録エラー:", err);
            alert(`取引詳細登録中にエラーが発生しました: ${err.message}`);
        }
    };

    // メインの購入処理
    const handlePurchase = async () => {
        if (cart.length === 0) {
            alert("購入リストがありません");
            return;
        }

        try {
            const { trdId, taxExcludedAmount } = await fetchTransaction(totalPrice);
            alert(`取引登録が完了しました。取引ID: ${trdId} (税抜合計金額: ${taxExcludedAmount} 円`);

            await fetchTransactionDetails(trdId);
            alert("取引詳細が登録されました");

            clearCart();
        } catch (err) {
            console.error(err);
            alert(`取引登録中にエラーが発生しました: ${err.message}`);
        }
    };

    // 🔹 商品コード変更時に自動で商品情報を取得
    useEffect(() => {
        if (code.trim()) {
            fetchProductInfo();
        }
    }, [code]); // codeが変更されたらfetchProductInfoを実行

    

    // 商品コード読み込みボタン
    const fetchProductInfo = async () =>{
        try {
            setError("null");//エラーリセット
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
            setProductName(data.NAME || "");//商品名セット
            setProductPrice(data.PRICE || "");//単価セット
        } catch (err) {
            setError(err.message);
            setProductName(""); // 商品情報リセット
            setProductPrice(null);
        }
    };

    // 🔹 商品情報を削除する関数
    const clearProductInfo = () => {
        setCode("");
        setProductName("");
        setProductPrice(null);
    };

    // カートに追加。setCartにはバックエンドに送る内容をいれておきました。。。
    const addToCart = () => {
        if (productName && productPrice) {
            setCart([...cart, {PRD_CODE: code, name: productName, price: productPrice}]);
            setProductName("");
            setProductPrice(null);
        }
    };

    const clearCart = () => {
        setCart([]);
        setTotalPrice(0);
    }


    const handleGoBack = () => {
        // new-transaction ページに戻る
        router.push("/new-transaction");
    };

    // 🔹 商品情報がない場合はカメラを起動し、商品情報がある場合はカメラを停止
    useEffect(() => {
        if (!productName) {
            startScanning();
        } else {
            stopScanning();
        }
    }, [productName]);

    // QuaggaJSの初期化と設定
    const startScanning = () => {
        if (isScanning) return; // すでにスキャン中なら何もしない

        Quagga.init({
            inputStream : {
                name : "Live",
                type : "LiveStream",
                target: document.querySelector('#scanner-container'),    // スキャン表示先
                constraints: {
                    width: 640,
                    height: 480,
                    facingMode: "environment" // 背面カメラを使用
                }
            },
            decoder : {
              readers : ["ean_reader"]  // 今回は"ean_reader"のみ
            }
        }, (err) => {
            if (err) {
                console.log(err);
                return
            }
            console.log("Initialization finished. Ready to start");
            //setScanning(true); // 初期化後に自動でスキャンを開始する場合はコメントを外す
            Quagga.start();
            setIsScanning(true);
        });

        // 🔹 バーコードを検出したときの処理
        Quagga.onDetected((result) => {
            setCode(result.codeResult.code); // 読み取ったバーコードをstateにセット
        });
    };

    // Quaggaの停止
    const stopScanning = () => {
        if (!isScanning) return; // すでに停止中なら何もしない
        Quagga.stop();
        setIsScanning(false);
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

            {/* 読み取ったバーコードを表示 */}
            <div id="scanner-container" style={{ width: '640px', height: '480px', border: "2px solid black" }}></div>
            <p>読み取ったバーコード: {code}</p>
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
                <button onClick={clearProductInfo} style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    color: "white",
                    backgroundColor: "#FF0000",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}>
                    削除
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