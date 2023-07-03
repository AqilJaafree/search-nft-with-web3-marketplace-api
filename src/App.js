import logo from './logo.svg';
import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [nftData, setNftData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  async function requestAccount() {
    setLoading(true);
    setError('');

    try {
      if (window.ethereum) {
        console.log('Metamask Detected');
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAddress(accounts[0]);
      } else {
        console.log('Metamask Not Detected');
      }
    } catch (e) {
      console.log(e);
      setError('An error occurred while connecting.');
    }

    setLoading(false);
  }

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  async function searchNft() {
    if (!searchTerm) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const openSeaHeaders = new Headers();
      openSeaHeaders.append('X-API-KEY', '36bcfeb8b7b848dd9eec125683d47078');

      const openSeaRequestOptions = {
        method: 'GET',
        headers: openSeaHeaders,
        redirect: 'follow',
      };

      const openSeaResponse = await fetch(
        `https://api.opensea.io/v2/collection/{slug}/nfts?limit=50`,
        openSeaRequestOptions
      );
    
      const openSeaData = await openSeaResponse.json();
    
      console.log('OpenSea Data:', openSeaData);
    
      setNftData(openSeaData);
    } catch (error) {
      console.error(error);
      setError('An error occurred while fetching NFT data');
    }

    setLoading(false);
  }

  useEffect(() => {
    requestAccount();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={requestAccount} disabled={loading}>
          Connect
        </button>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {address && <h3>Wallet Address: {address}</h3>}

        <div>
          <input
            type="text"
            placeholder="Enter search term"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button onClick={searchNft} disabled={loading}>
            Search NFT
          </button>
        </div>

        {nftData && (
  <div>
    <h2>Search Results</h2>
    {nftData.assets && nftData.assets.length > 0 ? (
      <div>
        {nftData.assets.map((asset) => (
          <div key={asset.token_id}>
            <h3>NFT Details</h3>
            <p>NFT Name: {asset.name}</p>
            <p>Token ID: {asset.token_id}</p>
            <img src={asset.image_url} alt={asset.name} />
          </div>
        ))}
      </div>
    ) : (
      <p>No NFTs found</p>
    )}
  </div>
)}

      </header>
    </div>
  );
}

export default App;
