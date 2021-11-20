import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'ikavalerov';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
  'https://media.giphy.com/media/xT1XGOGdyDrL2BTfxK/giphy.gif',
  'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif',
  'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif',
  'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif'
];

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);
  
  /*
   * Lets check if Phantom wallet is connected
   * */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom Wallet found!');

          /* Now lets check if we are logged in */
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'connected with public key: ',
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana wallet not found!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with public key: ', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString())
    }
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log("New GIF link: ", inputValue);
    } else {
      console.log("Empty input, try again.");
    }
  }

  const onInputChange = (event) => {
    const {value} = event.target;
    setInputValue(value);
  }

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet} 
      >
             Connect to wallet
    </button>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form onSubmit={(event) => {event.preventDefault(); sendGif();}}>
        <input type="text" placeholder="Enter GIF link!" value={inputValue} onChange={onInputChange}/>
        <button type="submit" className="cta-button submit=gif-button"> Submit </button>
      </form>
      <div className="gif-grid">
        {gifList.map(gif => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  useEffect( () => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, [] );

  useEffect( () => {
    if (walletAddress) {
      console.log("Fetching GIF list...");

      // Call Solana here

      // set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress] );

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🖼 Product Management GIF Portal</p>
          <p className="sub-text">
            View your web3 PM related GIFs for easy sharing
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
