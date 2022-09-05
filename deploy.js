const ethers = require('ethers');
const fs = require('fs-extra');
require('dotenv').config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  // creating wallet from private key
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // // creating wallet from encrypted private key
  // const encryptedJson = fs.readFileSync('./encryptKey.json', 'utf-8');
  // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //   encryptedJson,
  //   process.env.PRIVATE_KEY_PASSWORD
  // );
  // // connect wallet with provider
  // wallet = await wallet.connect(provider);

  const abi = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.abi', 'utf-8');
  const binary = fs.readFileSync(
    './SimpleStorage_sol_SimpleStorage.bin',
    'utf-8'
  );

  const contractFractroy = new ethers.ContractFactory(abi, binary, wallet);
  console.log('Deploying, please wait...');

  const contract = await contractFractroy.deploy();
  // 1 => number of confirmations that we want to wait
  // const transactionReceipt = await contract.deployTransaction.wait(1);
  await contract.deployTransaction.wait(1);

  console.log(`>>>>>> Contract Address: ${contract.address}`);

  // console.log('>>>>>> Deployment transaction (transaction response):');
  // console.log(contract.deployTransaction);

  // console.log('>>>>>> Transaction receipt:');
  // console.log(transactionReceipt);

  // console.log('>>>>>> Deploy with only transaction data:');
  // const chainId = await wallet.getChainId();
  // const nonce = await wallet.getTransactionCount();
  // const tx = {
  //   nonce,
  //   gasPrice: 20000000000,
  //   gasLimit: 1000000,
  //   to: null,
  //   value: 0,
  //   data: `0x${binary}`,
  //   chainId,
  // };

  // const sentTxReponse = await wallet.sendTransaction(tx);
  // console.log(sentTxReponse);

  const currentFavNum = await contract.retrieve();
  console.log(`>>>>>> Current Favourite Number: ${currentFavNum.toString()}`);

  const transactionResponse = await contract.store('7');
  const transactionReceipt = await transactionResponse.wait(1);

  const updatedFavNum = await contract.retrieve();
  console.log(`>>>>>> Updated Favourite Number: ${updatedFavNum.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
