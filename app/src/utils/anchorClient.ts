import { AnchorProvider, Program, BN } from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import idl from '../idl/escrow.json';
import { Escrow } from '../types/escrow';

const PROGRAM_ID = new PublicKey(idl.address);

export const getProgram = (connection: Connection, wallet: AnchorWallet) => {
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: 'processed',
  });
  return new Program(idl as any, provider) as Program<Escrow>;
};

export const getOptionPDA = (seller: PublicKey, underlying: string) => {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('option'), seller.toBuffer(), Buffer.from(underlying)],
    PROGRAM_ID
  );
  return pda;
};

export const initializeOption = async (
  program: Program<Escrow>,
  optionType: number,
  underlying: string,
  initiationDate: BN,
  price: BN,
  strike: BN,
  initialMargin: BN,
  isTest: boolean,
  seller: PublicKey
) => {
  const optionPda = getOptionPDA(seller, underlying);
  
  const tx = await program.methods
    .initializeOption(
      optionType,
      underlying,
      initiationDate,
      price,
      strike,
      initialMargin,
      isTest
    )
    .accountsPartial({
      option: optionPda,
      seller: seller,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  
  return { tx, optionPda };
};

export const purchaseOption = async (
  program: Program<Escrow>,
  optionPda: PublicKey,
  buyer: PublicKey,
  seller: PublicKey
) => {
  const tx = await program.methods
    .purchaseOption()
    .accountsPartial({
      option: optionPda,
      buyer: buyer,
      seller: seller,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  
  return tx;
};

export const dailySettlement = async (
  program: Program<Escrow>,
  optionPda: PublicKey,
  assetPriceUsd: BN,
  solPriceUsd: BN,
  settler: PublicKey
) => {
  const tx = await program.methods
    .dailySettlement(assetPriceUsd, solPriceUsd)
    .accountsPartial({
      option: optionPda,
      settler: settler,
    })
    .rpc();
  
  return tx;
};

export const exerciseOption = async (
  program: Program<Escrow>,
  optionPda: PublicKey,
  assetPriceUsd: BN,
  solPriceUsd: BN,
  owner: PublicKey
) => {
  const tx = await program.methods
    .exerciseOption(assetPriceUsd, solPriceUsd)
    .accountsPartial({
      option: optionPda,
      owner: owner,
    })
    .rpc();
  
  return tx;
};

export const resellOption = async (
  program: Program<Escrow>,
  optionPda: PublicKey,
  resalePrice: BN,
  currentOwner: PublicKey,
  newBuyer: PublicKey
) => {
  const tx = await program.methods
    .resellOption(resalePrice)
    .accountsPartial({
      option: optionPda,
      currentOwner: currentOwner,
      newBuyer: newBuyer,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  
  return tx;
};

export const delistOption = async (
  program: Program<Escrow>,
  optionPda: PublicKey,
  seller: PublicKey
) => {
  const tx = await program.methods
    .delistOption()
    .accountsPartial({
      option: optionPda,
      seller: seller,
    })
    .rpc();
  
  return tx;
};

export const formatLamportsToSol = (lamports: number | BN): string => {
  const value = typeof lamports === 'number' ? lamports : lamports.toNumber();
  return (value / 1e9).toFixed(4);
};

export const formatTimestamp = (timestamp: number | BN): string => {
  const value = typeof timestamp === 'number' ? timestamp : timestamp.toNumber();
  return new Date(value * 1000).toLocaleString();
};

export const getOptionTypeLabel = (optionType: number): string => {
  return optionType === 0 ? 'Call' : 'Put';
};

export const getStatusLabel = (status: any): string => {
  if (status.listed) return 'Listed';
  if (status.owned) return 'Owned';
  if (status.expired) return 'Expired';
  if (status.delisted) return 'Delisted';
  if (status.marginCalled) return 'Margin Called';
  return 'Unknown';
};