const blockParser = (buf) => {
  if(buf.length < 372)
    throw new Error("Length is too short.");

  let offset = 0;
  
  const size = buf.readUInt32LE(offset);
  offset += 4;
  
  const reserved1 = buf.readUInt32LE(offset);
  offset += 4;
  
  const signature = buf.slice(offset, offset + 64);
  offset += 64;
  
  const signerPublicKey = buf.slice(offset, offset + 32);
  offset += 32;
  
  const reserved2 = buf.readUInt32LE(offset);
  offset += 4;
  
  const version = buf.readUInt8(offset);
  offset += 1;
  
  const network = buf.readUInt8(offset);
  offset += 1;
  
  const type = buf.readUInt16LE(offset);
  offset += 2;
  
  const height = buf.readBigUInt64LE(offset);
  offset += 8;
  
  const timestamp = buf.readBigUInt64LE(offset);
  offset += 8;
  
  const difficulty = buf.readBigUInt64LE(offset);
  offset += 8;
  
  const proofGamma = buf.slice(offset, offset + 32);
  offset += 32;
  
  const proofVarificationHash = buf.slice(offset, offset + 16);
  offset += 16;
  
  const proofScalar = buf.slice(offset, offset + 32);
  offset += 32;
  
  const previousBlockHash = buf.slice(offset, offset + 32);
  offset += 32;
  
  const transactionsHash = buf.slice(offset, offset + 32);
  offset += 32;
  
  const receiptsHash = buf.slice(offset, offset + 32);
  offset += 32;
  
  const stateHash = buf.slice(offset, offset + 32);
  offset += 32;
  
  const beneficiaryAddress = buf.slice(offset, offset + 24);
  offset += 24;
  
  const feeMultiplier = buf.readUInt32LE(offset);
  offset += 4;

  return {
    size,
    signature: signature.toString("hex"),
    signerPublicKey: signerPublicKey.toString("hex"),
    version,
    network,
    type,
    height: height.toString(),
    timestamp: timestamp.toString(),
    difficulty: difficulty.toString(),
    proofGamma: proofGamma.toString("hex"),
    proofVarificationHash: proofVarificationHash.toString("hex"),
    proofScalar: proofScalar.toString("hex"),
    previousBlockHash: previousBlockHash.toString("hex"),
    transactionsHash: transactionsHash.toString("hex"),
    receiptsHash: receiptsHash.toString("hex"),
    stateHash: stateHash.toString("hex"),
    beneficiaryAddress: beneficiaryAddress.toString("hex"),
    feeMultiplier
  };
};

module.exports = blockParser;
