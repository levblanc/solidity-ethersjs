import { ethers } from 'ethers';
import * as fs from 'fs-extra';
import 'dotenv/config';

async function encryptKey() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!);
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD!,
    process.env.PRIVATE_KEY!
  );

  try {
    fs.writeFileSync('./encryptKey.json', encryptedJsonKey);
    console.log('>>>>>> Encryption success!');
  } catch (error) {
    console.log('>>>>>> Encryption falied!');
    console.error(error);
  }
}

encryptKey()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
