import React from "react";
import { useState, useEffect } from "react";
function About() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nftData, setNftData] = useState(null);

  // Function to fetch NFT listings
  const fetchNftListings = async () => {
    setLoading(true);
    setError("");

    try {
      // OpenSea API
      var openSeaHeaders = new Headers();
      openSeaHeaders.append("X-API-KEY", "36bcfeb8b7b848dd9eec125683d47078");

      var openSeaRequestOptions = {
        method: "GET",
        headers: openSeaHeaders,
        redirect: "follow",
      };

      const openSeaResponse = await fetch(
        `https://api.opensea.io/v2/orders/ethereum/seaport/listings?order_by=created_date&order_direction=desc`,
        openSeaRequestOptions
      );

      const openSeaData = await openSeaResponse.json();
      console.log("OpenSea Data:", openSeaData);

      // Magic Eden API
      const magicEdenUrl =
        "https://api-mainnet.magiceden.dev/v2/collections/symbol/listings";
      const magicEdenOptions = {
        method: "GET",
        headers: { accept: "application/json" },
      };

      const magicEdenResponse = await fetch(magicEdenUrl, magicEdenOptions);
      const magicEdenData = await magicEdenResponse.json();
      console.log("Magic Eden Data:", magicEdenData);

      // Store the fetched NFT data in the state
      setNftData({ openSeaData, magicEdenData });
    } catch (error) {
      setError("An error occurred while fetching NFT data");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNftListings(); // Fetch NFT listings on page refresh
  }, []); // Empty dependency array to run the effect only once

  return (
    <div className="App">
      <header className="App-header">
        {/* Display NFT Data */}
        {nftData && (
          <div>
            <h2>Recent NFT Listings</h2>
            {nftData.openSeaData && nftData.openSeaData.orders.length > 0 ? (
              <div>
                {nftData.openSeaData.orders.map((order) => (
                  <div key={order.order_hash}>
                    <h3>Order Details</h3>
                    <p>NFT Name: {order.maker_asset_bundle.assets[0].name}</p>
                    <p>
                      Minted Date:{" "}
                      {order.maker_asset_bundle.assets[0].created_date}
                    </p>
                    {/* Display other order details as needed */}

                    {order.maker && (
                      <div>
                        <h3>Maker Details</h3>
                        <p>Ethereum Address: {order.maker.address}</p>
                        {/* Display other maker details as needed */}
                      </div>
                    )}

                    {order.maker_asset_bundle &&
                      order.maker_asset_bundle.assets.length > 0 && (
                        <div>
                          <h3>Assets</h3>
                          {order.maker_asset_bundle.assets.map((asset) => (
                            <div key={asset.token}>
                              <p>Token: {asset.token}</p>
                              <img src={asset.image_url} alt={asset.name} />
                              {/* Display other asset details as needed */}
                            </div>
                          ))}
                        </div>
                      )}
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

export default About;
