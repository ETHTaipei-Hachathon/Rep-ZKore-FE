/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Group } from '@semaphore-protocol/group';
import { Identity } from '@semaphore-protocol/identity';
import { generateProof, verifyProof } from '@semaphore-protocol/proof';

// import { groth16 } from 'snarkjs
import verificationKey from './semaphore_file/semaphore.json';

export function createIdentity(password) {
  // Set account and name, password
  return new Identity(password);
}

// export async function addMemberToGroup(identity) {
//   const addNewMember = await semaphore
//     .connect(deployer)
//     .addMember(1, identity.commitment);
//   await addNewMember.wait();
//   console.log('add member');
// }

export async function generateZkProof(identity) {
  // generate proof
  const group = new Group(16, 1);
  group.addMember(identity.commitment);
  const frontendExternalNullifier = group.root;

  const greeting =
    '0x000000000000000000000000000000000000000000000000000000000000007b';

  // const fullProof = await generateProof(
  //   identity,
  //   group,
  //   frontendExternalNullifier,
  //   greeting,
  //   {
  //     zkeyFilePath: './semaphore_file/semaphore.zkey',
  //     wasmFilePath: './semaphore_file/semaphore.wasm',
  //   }
  // );

  let merkleProof;

  if ('depth' in group) {
    const index = group.indexOf(identity.commitment);

    if (index === -1) {
      throw new Error('The identity is not part of the group');
    }

    merkleProof = group.generateMerkleProof(index);
  } else {
    merkleProof = group;
  }

  const fullProof = await window.snarkjs.groth16.fullProve(
    {
      identityTrapdoor: identity.trapdoor,
      identityNullifier: identity.nullifier,
      treePathIndices: merkleProof.pathIndices,
      treeSiblings: merkleProof.siblings,
      externalNullifier: hash(frontendExternalNullifier),
      signalHash: hash(greeting),
    },
    './semaphore_file/semaphore.zkey',
    './semaphore_file/semaphore.wasm'
  );

  const { merkleRoot, nullifierHash, signalHash, externalNullifier } =
    fullProof.publicSignals;

  const calldata = await window.snarkjs.groth16.exportSolidityCallData(
    fullProof.proof,
    [merkleRoot, nullifierHash, signalHash, externalNullifier]
  );
  const args = JSON.parse(`[${calldata}]`);
  return { fullProof, args };
}

export async function verifyProofLocal(fullProof) {
  // verify proof offchain
  const pass = await verifyProof(verificationKey, fullProof);
  console.log('verify proof off chain:', pass);
  return pass;
}
