import { Box, Button, Input, FormControl, FormLabel, Text, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';
import { useWeb3 } from '../context/Web3Context';

// Custom type guard for error with message
function isErrorWithMessage(error: any): error is { message: string } {
  return error && typeof error === 'object' && 'message' in error && typeof error.message === 'string';
}

const FileUpload: React.FC<{ onUploadSuccess: (file: { fileName: string; fileHash: string; description: string }) => void }> = ({ onUploadSuccess }) => {
  const { fileSharingContract, account } = useWeb3();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const toast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadToPinata = async (file: File) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();
    data.append('file', file);
    const response = await axios.post(url, data, {
      headers: {
        'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
        'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.IpfsHash;
  };

  const handleUpload = async () => {
    if (!file || !fileName || !description) {
      toast({
        title: 'Missing Data',
        description: 'Please select a file, provide a name, and description.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!fileSharingContract || !account) {
      toast({
        title: 'Error',
        description: 'Wallet not connected or contract not initialized.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const ipfsHash = await uploadToPinata(file);
      toast({
        title: 'IPFS Upload Success',
        description: `File uploaded to IPFS with hash ${ipfsHash}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      const tx = await fileSharingContract.uploadFile(ipfsHash, fileName, description);
      await tx.wait();

      onUploadSuccess({ fileName, fileHash: ipfsHash, description });
      toast({
        title: 'Blockchain Upload Success',
        description: `File registered on blockchain with hash ${ipfsHash}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setFile(null);
      setFileName('');
      setDescription('');
    } catch (error) {
      console.error('Upload Error:', error);
      let errorMessage = 'Failed to upload file.';
      // Type guard to check if error is an object with 'code' property
      if (error && typeof error === 'object' && 'code' in error && error.code === 4001) {
        errorMessage = 'Transaction rejected by user in MetaMask.';
      }
      // Type guard to check if error has a message property and is a string
      else if (isErrorWithMessage(error) && error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for gas fees.';
      }
      toast({
        title: 'Upload Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <FormControl>
        <FormLabel color="white">File</FormLabel>
        <Input type="file" onChange={handleFileChange} color="white" borderColor="gray.600" _hover={{ borderColor: 'gray.500' }} />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel color="white">Name</FormLabel>
        <Input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter file name"
          color="white"
          borderColor="gray.600"
          _hover={{ borderColor: 'gray.500' }}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel color="white">Description</FormLabel>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          color="white"
          borderColor="gray.600"
          _hover={{ borderColor: 'gray.500' }}
        />
      </FormControl>
      <Button mt={4} colorScheme="teal" onClick={handleUpload}>
        Upload to Blockchain
      </Button>
    </Box>
  );
};

export default FileUpload;