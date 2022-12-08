import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect, isconnected } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from "jquery";



const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

function App() {

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(``);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;

   /*  if (mintAmount > 1) {
      cost = 3000000000000000;
    } */

    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Have some patience...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .Mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `You got it!!!`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };


  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  const connected = () => {
    document.getElementById("connectbtn").style.display = "none";
     
    document.getElementById("text1").style.display = "none";
  };

  const changeAbout = () => {
    document.getElementById("connectbtn").style.display = "none";
     
    document.getElementById("text1").style.display = "none";
    document.getElementById("text1").style.display = "flex";
    document.getElementById("comingsoon").style.display = "none";
  };

  const changeTeam = () => {
    document.getElementById("connectbtn").style.display = "none";
     
    document.getElementById("text1").style.display = "none";
    document.getElementById("comingsoon").style.display = "none";
  };


  const changeMint = () => {
    document.getElementById("connectbtn").style.display = "flex";

    document.getElementById("text1").style.display = "none";
    document.getElementById("comingsoon").style.display = "none";
  };

  const changeMarket = () => {
    document.getElementById("connectbtn").style.display = "none";
     
    document.getElementById("text1").style.display = "none";
    document.getElementById("comingsoon").style.display = "block";
  };

  const changeStake = () => {
    document.getElementById("connectbtn").style.display = "none";
     
    document.getElementById("text1").style.display = "none";
    document.getElementById("comingsoon").style.display = "block";
  };





  return (
    <div>
      <div className="home">


    

        <div style={{width: '100%', height: '100%'}}>
          <BG></BG>
        </div>

       <div style={{width: '100%', height: '80vh'}}>
       <BG2>
        <div id="connectbtn"
            onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
              getData();
              connected();
            }}
          >
            CONNECT
          </div>

          <div id="about" onClick={changeAbout}>About</div>
          <div id="mint" onClick={changeMint}>Mint</div>
          <div id="team" onClick={changeTeam}>Team</div>
          <div id="stake" onClick={changeStake}>Stake</div>
          <div id="market" onClick={changeMarket}>Market</div>


          <div style={{width: '30%', marginTop: '36vh', display: 'none'}} id="text1">
            <p>Rare y00ts is "the art y00ts should have been." Together we will discover Rare y00tsland and crown 
              the Rare y00ts king. Holding a Rare y00ts gives you access to Rare y00tsland which unlocks a range of web2, web3, and 
              irl benefits. Our art was meticulously designed by two y00ts holders who love their y00ts but wanted more 
              diversity in the looks. "Not all y00ts wear glasses" half the supply and double the traits on Ethereum blockchain.</p>
          </div>

          <div style={{width: '30%', marginTop: '40vh', display: 'none'}} id="comingsoon">
            <p style={{ fontFamily: '"yoot", cursive', fontSize: '4.5em'}}>COMING SOON...</p>
          </div>

        </BG2>
       </div>

       


      

        {/*Mint Section*/}
        <div className="mint">
          {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
            <>
              <div
                className="soldout" style={{ fontFamily: "'yoot', cursive", color: 'black'}}
              >
                SOLD OUT!
              </div>
              <s.SpacerSmall />
            </>
          ) : (
            <>
              <s.SpacerXSmall />
              <s.SpacerSmall />
              {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                <s.Container ai={"center"} jc={"center"}>
                  <s.SpacerSmall />

                  {blockchain.errorMsg !== "" ? (
                    <>
                      <s.SpacerSmall />
                    </>
                  ) : null}
                </s.Container>
              ) : (
                <>
                  <div onLoad={connected()}></div>
                  <s.SpacerMedium />
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <btn id="roundbtn" className="round-button"
                      style={{ fontFamily: "'yoot', cursive", color: 'black', cursor: 'pointer' }}
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        decrementMintAmount();
                      }}
                    >
                      -
                    </btn>
                    <s.SpacerMedium />
                    <s.TextDescription id="mint-amount"
                      style={{
                        textAlign: "center",
                        color: 'black', fontFamily: "'yoot', cursive"
                      }}
                    >
                      {mintAmount}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <btn className="round-button"
                      style={{ fontFamily: "'yoot', cursive", color: 'black', cursor: 'pointer' }}
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        incrementMintAmount();
                      }}
                    >
                      +
                    </btn>
                  </s.Container>
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <div className="mintbtn" style={{ fontFamily: "'yoot', cursive", color: 'black', fontSize: '4em', cursor: 'pointer', marginTop: '2px', marginLeft: '8px' }}
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs();
                        getData();
                      }}
                    >
                      MINT!
                    </div>
                  </s.Container>
                </>
              )}
            </>
          )}
        </div>
      </div>






      <Phone>
      
      </Phone>
    </div>
  );
}


export const Phone = styled.div`
display: flex; 
flex-direction: column; 
justify-self: center; 
align-items: center; 
height: 100vh;
minWidth: 100%;
background-image: url("/config/images/ybg.png");
background-position: 50%; 
background-repeat: no-repeat;
background-size: cover; 
text-align: center; 
@media (orientation: landscape) {
  display: none;
}
`;

export const BG = styled.div`
display: flex; 
flex-direction: column; 
justify-self: center; 
align-items: center; 
height: 100vh; 
minWidth: 100%;
background-image: linear-gradient(180deg,transparent 80%,#FAF4F4), url("/config/images/ybg.png");
background-position: 50%; 
background-repeat: no-repeat;
background-size: cover; 
text-align: center; 
box-sizing: border-box;
`;

export const BG2 = styled.div`
display: flex; 
flex-direction: column; 
justify-self: center; 
align-items: center; 
height: 90vh; 
minWidth: 100%;
background-image: linear-gradient(180deg,transparent 93%,#FAF4F4), url("/config/images/bg2.png");
background-position: 50%; 
background-repeat: no-repeat;
background-size: cover; 
text-align: center; 
box-sizing: border-box;
`;

export default App;
