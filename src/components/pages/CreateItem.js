import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ethers } from "ethers";
import { create as ipfshttpclient } from "ipfs-http-client";
import Web3Modal from "web3modal";
import { nftaddress, nftmarketaddress } from "../../config";

import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFT_MarketPlace.sol/NFTMarket.json";
const client = ipfshttpclient("https://ipfs.infura.io:5001/api/v0");

const CreateItem = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = Route;

  async function onChange(e) {
    const file = e.target.files[0];
    console.log("file:" + file);
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (e) {
      console.log(e);
    }
  }

  async function createItem() {
    console.log("button click create item");
    const { name, description, price } = formInput;
    console.log(formInput);
    if (!name || !description || !price || !fileUrl) return;
    const data = JSON.stringify({ name, description, image: fileUrl, price });
    console.log("data->", data);
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      createSale(url);
    } catch (e) {
      console.log("Error uploading file: ", e);
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();

    let event = tx.events[0];
    console.log(event);
    let value = event.args[2];
    console.log(value);
    let tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(formInput.price, "ether");
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });

    await transaction.wait();
    return (
      <Routes>
        <Route path="/" />;
      </Routes>
    );
  }

  return (
    <Card sx={{ minWidth: 50 }}>
      <CardHeader></CardHeader>
      <CardContent>
        <Grid>
          <Grid item xs={6} rowSpacing={2} sx={{ m: 2 }}>
            <TextField
              label="Asset Name"
              placeholder="Asset Name"
              onChange={(e) =>
                updateFormInput({ ...formInput, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={6} rowSpacing={2} sx={{ m: 2 }}>
            <TextField
              label="Asset Description"
              name="description"
              multiline
              maxRows={4}
              onChange={(e) =>
                updateFormInput({ ...formInput, description: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={6} rowSpacing={2} sx={{ m: 2 }}>
            <TextField
              placeholder="Asset Price in Eth"
              name="price"
              onChange={(e) =>
                updateFormInput({ ...formInput, price: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={6} rowSpacing={2} sx={{ m: 2 }}>
            <TextField type="file" name="fileUrl" onChange={onChange} />
            {fileUrl && (
              <img className="rounded mt-4" width="350" src={fileUrl} alt="" />
            )}
          </Grid>
          <Grid item xs={6} rowSpacing={2} sx={{ m: 2 }}>
            <Button onClick={createItem} variant="contained">
              Create digital Asset
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CreateItem;
