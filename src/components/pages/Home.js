import React from "react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { nftaddress, nftmarketaddress } from "../../config";
//import NFT from ""
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFT_MarketPlace.sol/NFTMarket.json";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const Home = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    console.log("use effect in index");
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://matic-mumbai.chainstacklabs.com"
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();
    console.log("data--", data);
    const items = await Promise.all(
      data.map(async (i) => {
        let tokenUri = await tokenContract.tokenURI(i.tokenId);
        console.log("tokenURi->", tokenUri);
        tokenUri = tokenUri.replace("https :", "https:");
        const meta = await axios.get(tokenUri);
        console.log("meta--", meta);

        let price = ethers.utils.formatUnits(i.price.toString(), 3);
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        //console.log("item:" + item);
        return item;
      })
    );
    //  console.log(items);
    setNfts(items);
    setLoadingState("loaded");
  }

  async function buyNft(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), 3);

    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();
    loadNFTs();
  }
  //console.log(loadingState);
  //console.log(nfts)
  if (loadingState === "loaded" && !nfts.length) {
    // console.log("you are in if");
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace!!</h1>;
  } else {
    console.log("you are here");
    nfts.map((nft, i) => console.log(nft.name));
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
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
                <Typography gutterBottom variant="h5" component="div">
                  {nft.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {nft.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {nft.price} Matic
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => buyNft(nft)}>
                  Buy
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Home;
