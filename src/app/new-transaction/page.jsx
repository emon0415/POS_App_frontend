"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const NewTransactionPage = () => {
    const [empCd, setEmpCd] = useState("9999999999"); // 初期値: レジ担当者コード
    const [storeCd, setStoreCd] = useState("30"); // 初期値: 店舗コード
    const [posNo, setPosNo] = useState("90"); // 初期値: POS機ID
    const router = useRouter();

    const handleProceed = () => {
        if (!empCd || !storeCd || !posNo) {
            alert("全ての項目を入力してください");
            return;
        }

        // コード読み取りページに移動 (例として仮のURL)
        router.push(`/scan-code?empCd=${empCd}&storeCd=${storeCd}&posNo=${posNo}`);
    };

    return (
        <div className="animate-psychedelic"
            style={{
                backgroundColor: "#f2f2f2",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
                padding: "20px"
            }}
        >
            <h1 className="psychedelic-title">新規取引を開始</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "5px" , color: "#fff" }}>レジ担当者コード (EMP_CD)</label>
                    <input
                        type="text"
                        value={empCd}
                        onChange={(e) => setEmpCd(e.target.value)}
                        placeholder="レジ担当者コードを入力"
                        style={{
                            width: "300px",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px"
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: "block", marginBottom: "5px", color: "#fff" }}>店舗コード (STORE_CD)</label>
                    <input
                        type="text"
                        value={storeCd}
                        onChange={(e) => setStoreCd(e.target.value)}
                        placeholder="店舗コードを入力"
                        style={{
                            width: "300px",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px"
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: "block", marginBottom: "5px", color: "#fff" }}>POS機ID (POS_NO)</label>
                    <input
                        type="text"
                        value={posNo}
                        onChange={(e) => setPosNo(e.target.value)}
                        placeholder="POS機IDを入力"
                        style={{
                            width: "300px",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px"
                        }}
                    />
                </div>
                <button
                    onClick={handleProceed}
                    style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        fontSize: "16px",
                        backgroundColor: "#007BFF",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    コード読み取りへ進む
                </button>
            </div>
        </div>
    );
};

export default NewTransactionPage;
