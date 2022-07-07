import Head from 'next/head'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import Web3Modal from 'web3modal'
import {providers} from 'ethers'


export default function Home() {
  
  const [walletConnected, setWalletConnected] = useState(false);
  const [ens, setEns] = useState("");
  const [address, setAddress] = useState("");
  const web3ModalRef = useRef();
  


  const setEnsOrAddress = async (_address, web3Provider) =>{
    try {
      const ens = await web3Provider.lookupAddress(_address);
      if(ens){
        setEns(ens);
      } else {
        setAddress(_address)
      }
    } catch (err) {
      console.log(err);
    }
  }

  const getProviderOrSigner = async () => {
    
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const {chainId} = await web3Provider.getNetwork();
      if(chainId!==4){
        window.alert("Switch your network to Rinkeby.");
        throw new Error("Change network to Rinkeby");
      } 
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();
        await setEnsOrAddress(address, web3Provider);
        await web3Provider.on('disconnect',(accounts)=>{
          window.alert("User singed off");
        });
        return signer;
     }





  


  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(()=>{
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider:false
      });
      connectWallet();
      
    }
  },[walletConnected]);
  
  
  
  
  
  
  const renderButton = () => {
    if (walletConnected) {
      <div>Wallet connected</div>;
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  return (
    <div>
      <Head>
        <title>ENS Dapp</title>
        <meta name="description" content="ENS-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to LearnWeb3 Punks {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            Its an NFT collection for LearnWeb3 Punks.
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./learnweb3punks.png" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Vishal
      </footer>
    </div>
  );
}
