import React, { useEffect, useState } from "react";
import './App.css'
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json"
const App = () => {
  const [currentAcount, setCurrentAcount] = useState("");
  const contractAddress = "0x71d4B2Eecd675Cd472d3C8192aF2ACBe640A24eC"
  console.log("current acount: ", currentAcount);
  const contractABI = abi.abi;
  const checkIfWalletIsConnected = async () => {
    try {
      // window.ethereumにアクセスできることを確認
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have Metamask!")
      } else {
        console.log("We have the ethereum object", ethereum)
      }

      // ユーザーのウォレットアドレスの許可を確認
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAcount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error)
    }
  };
  // ウォレット接続を実装
  const connectWallet = async () => {
    try {
      // ユーザーが認証可能なウォレットアドレスを持っているか確認
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask");
        return;
      }
      // 持っている場合は、ユーザーに対してウォレットへのアクセス許可を求める。許可されれば、ユーザーの最初のウォレットアドレスを currentAccount に格納する。
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("connected: ", accounts[0])
      setCurrentAcount(accounts[0])
    } catch (error) {
      console.log(error);
    }
  };
  const wave = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer,
        )
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        console.log("Signer:", signer);
        // コントラクトに書き込む
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);
        await waveTxn.wait();
        console.log("Mining...", waveTxn.hash);
        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  };

  // Webページがロードされたときに関数を実行
  useEffect(() => { checkIfWalletIsConnected(); }, []);
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-level="hand-wave">👋</span>
          WELCOME!
        </div>
        <div className="bio">
          イーサリアムウォレットを接続して、「
          <span role="img" aria-level="hand-wave">👋</span>
          (Wave)を送ってください
          <span role="img" aria-label="shine">✨</span>
        </div>
        <button className="waveButton" onClick={wave}>
          Wave at me
        </button>
        {/* {ウオレット接続のボタンを実装} */}
        {!currentAcount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {currentAcount && (
          <button className="waveButton" onClick={connectWallet}>
            Wallet Connected
          </button>
        )}
      </div>
    </div>
  )
}
export default App;