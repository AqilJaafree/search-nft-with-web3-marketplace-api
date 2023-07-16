import logo from './logo.svg';
import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';
import NavBar from "./Navbar";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import { Link, Route, Routes } from "react-router-dom";

import { BrowserRouter as Router, Switch } from "react-router-dom";

function App() {
  
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nftData, setNftData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  async function requestAccount() {
    setLoading(true);
    setError("");

    try {
      if (window.ethereum) {
        console.log("Metamask Detected");
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);
      } else {
        console.log("Metamask Not Detected");
      }
    } catch (e) {
      console.log(e);
      setError("An error occurred while connecting.");
    }

    setLoading(false);
  }

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  async function searchNft() {
    
    if (!searchTerm) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const openSeaHeaders = new Headers();
      openSeaHeaders.append("X-API-KEY", "36bcfeb8b7b848dd9eec125683d47078");

      const openSeaRequestOptions = {
        method: "GET",
        headers: openSeaHeaders,
        redirect: "follow",
      };

      const openSeaResponse = await fetch(
        `https://api.opensea.io/v2/collection/${searchTerm}/nfts?limit=50`,
        openSeaRequestOptions
      );

      const openSeaData = await openSeaResponse.json();

      console.log("OpenSea Data:", openSeaData);

      setNftData(openSeaData);
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching NFT data");
    }

    setLoading(false);
  }

  useEffect(() => {
    requestAccount();
  }, []);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route exact path="/Blogs" element={<Blogs />}></Route>
        <Route exact path="/About" element={<About />}></Route>
        <Route exact path="/Contact" element={<Contact />}></Route>
      </Routes>
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
              {nftData.nfts && nftData.nfts.length > 0 ? (
                <div>
                  {nftData.nfts.map((nft) => (
                    <div key={nft.token_id}>
                      <h3>NFT Details</h3>
                      <p>NFT Name: {nft.name}</p>
                      <p>Token Floor Price: {nft.floor_price}</p>
                      <p>Token Standard: {nft.token_standard}</p>
                      <img src={nft.image_url} alt={nft.name} />
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
    </Router>
  );
  
}

export default App;
