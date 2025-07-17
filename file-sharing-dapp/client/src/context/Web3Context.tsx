import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  fileSharingContract: ethers.Contract | null;
  userManagementContract: ethers.Contract | null;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  isConnected: false,
  connectWallet: async () => {},
  fileSharingContract: null,
  userManagementContract: null,
});

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [fileSharingContract, setFileSharingContract] = useState<ethers.Contract | null>(null);
  const [userManagementContract, setUserManagementContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
        const fileSharingAddress = process.env.REACT_APP_FILE_SHARING_CONTRACT_ADDRESS;
        const userManagementAddress = process.env.REACT_APP_USER_MANAGEMENT_CONTRACT_ADDRESS;
        const fileSharingABI = [
          "function getUserFiles(address user) view returns (tuple(string fileName, string fileHash, string description, uint256 version, address owner, bool isDeleted, address[] sharedWith)[])",
          "function getSharedFiles(address user) view returns (tuple(string fileName, string fileHash, string description, uint256 version, address owner, bool isDeleted, address[] sharedWith)[])",
          "function shareFile(string memory fileHash, address recipient) public",
          "function deleteFile(string memory fileName, uint256 version) public",
          "function uploadFile(string memory fileHash, string memory fileName, string memory description) public",
        ];
        const userManagementABI = [
          "function registerUser(string memory username, string memory passwordHash) public",
          "function login(string memory username, string memory passwordHash) view returns (bool)",
        ];
        if (fileSharingAddress) {
          setFileSharingContract(new ethers.Contract(fileSharingAddress, fileSharingABI, provider.getSigner()));
        }
        if (userManagementAddress) {
          setUserManagementContract(new ethers.Contract(userManagementAddress, userManagementABI, provider.getSigner()));
        }
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          setAccount(accounts[0] || null);
          setIsConnected(accounts.length > 0);
        });
      }
    };
    initWeb3();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error('User rejected wallet connection:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  return (
    <Web3Context.Provider value={{ account, isConnected, connectWallet, fileSharingContract, userManagementContract }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);