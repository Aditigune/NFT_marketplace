import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import axios from "axios";
import Web3Modal from "web3modal";
import { nftaddress, nftmarketaddress } from "../../config";
//import NFT from ""
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFT_MarketPlace.sol/NFTMarket.json";
import Card from "@mui/material/Card";

import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
const CreatorDashboard = () => {
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    console.log("use effect in dashboard");
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const data = await marketContract.fetchItemsCreated();

    const items = await Promise.all(
      data.map(async (i) => {
        let tokenUri = await tokenContract.tokenURI(i.tokenId);
        console.log(tokenUri);
        tokenUri = tokenUri.replace("https :", "https:");
        const meta = await axios.get(tokenUri);
        console.log(meta);

        let price = ethers.utils.formatUnits(i.price.toString(), 3);
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          sold: i.sold,
          image: meta.data.image,
        };
        return item;
      })
    );
    /* create a filtered array of items that have been sold */
    const soldItems = items.filter((i) => i.sold);
    setSold(soldItems);
    setNfts(items);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !nfts.length) {
    return (
      <div>
        <h1 className="py-10 px-20 text-3xl">No assets created</h1>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
      <h2 className="text-2xl py-2">Items Created</h2>
      <Grid container>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          {nfts.map((nft, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={nft.image}
                  alt="green iguana"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {nft.price} Matic
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <h2 className="text-2xl py-2">Items sold</h2>
      {Boolean(sold.length) && (
        <Grid container item xs={6} rowSpacing={2} sx={{ m: 2 }}>
          <Grid
            container
            spacing={2}
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            {sold.map((nft, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={nft.image}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {nft.price} Matic
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </div>
  );
};
export default CreatorDashboard;
