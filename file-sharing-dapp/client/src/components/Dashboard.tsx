import { Box, Button, Heading, VStack, Text, Flex, useToast, Input, IconButton, Icon, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Tabs, TabList, TabPanels, Tab, TabPanel, Table, Thead, Tbody, Tr, Th, Td, Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import FileUpload from './FileUpload';
import { DownloadIcon, ViewIcon, DeleteIcon, SettingsIcon, ArrowBackIcon, SunIcon, MoonIcon, CopyIcon } from '@chakra-ui/icons';
import { FaFile, FaFileAlt } from 'react-icons/fa';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

// Interface for file metadata
interface File {
  fileName: string;
  fileHash: string;
  description: string;
  version: number;
  owner: string;
  isDeleted: boolean;
  sharedWith: string[];
}

// Custom hook for theme management
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const themes = [
    {
      name: 'dark',
      primary: '#2b6777',
      secondary: '#52ab98',
      text: '#ffffff',
      cardBg: 'rgba(255, 255, 255, 0.05)',
      particleColor: '#ffffff',
      border: 'rgba(255, 255, 255, 0.1)',
      gradient: 'linear(to-r, #52ab98, #2b6777)',
    },
    {
      name: 'light',
      primary: '#2b6777',
      secondary: '#52ab98',
      text: '#2b6777',
      cardBg: 'rgba(82, 171, 152, 0.1)',
      particleColor: '#52ab98',
      border: '#52ab98',
      gradient: 'linear(to-r, #52ab98, #2b6777)',
    },
  ];

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, themeConfig: themes.find((t) => t.name === theme)!, toggleTheme };
};

// Motion components for animations
const MotionBox = motion(Box);
const MotionButton = motion(Button);

const Dashboard: React.FC = () => {
  const { account, isConnected, connectWallet, fileSharingContract } = useWeb3();
  const { theme, themeConfig, toggleTheme } = useTheme();
  const [userFiles, setUserFiles] = useState<File[]>([]);
  const [sharedFiles, setSharedFiles] = useState<File[]>([]);
  const [shareAddress, setShareAddress] = useState<string>('');
  const [selectedFileHash, setSelectedFileHash] = useState<string>('');
  const [previewFile, setPreviewFile] = useState<{ hash: string; fileName: string } | null>(null);
  const toast = useToast();
  const navigate = useNavigate();

  // Fetch user and shared files on component mount or when connection changes
  useEffect(() => {
    const fetchFiles = async () => {
      if (isConnected && account && fileSharingContract) {
        try {
          const sharedFilesData = await fileSharingContract.getSharedFiles(account);
          setSharedFiles(sharedFilesData);
        } catch (error) {
          console.error('Error fetching files:', error);
          toast({
            title: 'Welcome',
            description: 'Ready to upload',
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
        }
      }
    };
    fetchFiles();
  }, [isConnected, account, fileSharingContract, toast]);

  // Initialize particle background
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const particlesLoaded = async () => {
    return Promise.resolve();
  };

  // Disconnect wallet and reset state
  const handleDisconnectWallet = () => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts', params: [{ eth_accounts: [] }] });
      toast({
        title: 'Wallet Disconnected',
        description: 'You have disconnected your wallet.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      setUserFiles([]);
      setSharedFiles([]);
      navigate('/');
    }
  };

  // Share a file with another address
  const handleShareFile = async () => {
    if (!fileSharingContract || !selectedFileHash || !shareAddress) {
      toast({
        title: 'Error',
        description: 'Please select a file and provide a recipient address.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!ethers.utils.isAddress(shareAddress)) {
      toast({
        title: 'Invalid Address',
        description: 'Please enter a valid Ethereum address.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const gasEstimate = await fileSharingContract.estimateGas.shareFile(selectedFileHash, shareAddress);
      const tx = await fileSharingContract.shareFile(selectedFileHash, shareAddress, {
        gasLimit: gasEstimate.mul(120).div(100),
      });
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        const sharedFilesData = await fileSharingContract.getSharedFiles(account);
        setSharedFiles(sharedFilesData);
        toast({
          title: 'File Shared',
          description: `Shared with ${shareAddress.slice(0, 6)}...${shareAddress.slice(-4)}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setShareAddress('');
        setSelectedFileHash('');
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error: any) {
      console.error('Share File Error:', error);
      let errorMessage = 'Failed to share file.';
      if (error.code === 4001) {
        errorMessage = 'Transaction rejected by user in MetaMask.';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for gas fees.';
      } else if (error.message.includes('revert')) {
        errorMessage = 'Transaction reverted. Ensure the file hash exists and you have permission to share.';
      }
      toast({
        title: 'Share Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Download a file from IPFS
  const handleDownloadFile = async (fileHash: string, fileName: string) => {
    try {
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${fileHash}`;
      const response = await axios.get(ipfsUrl, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({
        title: 'Download Started',
        description: `Downloading ${fileName}...`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Failed to download file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Open file preview modal
  const handleViewFile = (fileHash: string, fileName: string) => {
    setPreviewFile({ hash: fileHash, fileName });
  };

  // Delete a file
  const handleDeleteFile = async (fileName: string, version: number) => {
    if (!fileSharingContract || !account) return;
    try {
      const tx = await fileSharingContract.deleteFile(fileName, version);
      await tx.wait();
      const updatedFiles = await fileSharingContract.getUserFiles(account);
      setUserFiles(updatedFiles);
      toast({
        title: 'File Deleted',
        description: `Deleted ${fileName}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Copy IPFS hash to clipboard
  const handleCopyHash = (fileHash: string) => {
    navigator.clipboard.writeText(fileHash);
    toast({
      title: 'Hash Copied',
      description: 'IPFS hash copied to clipboard.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // Render file preview based on file type
  const renderFilePreview = (fileHash: string) => {
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${fileHash}`;
    const fileExtension = previewFile?.fileName.split('.').pop()?.toLowerCase() || 'unknown';

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <Image src={ipfsUrl} alt="Preview" maxW="100%" maxH="400px" borderRadius="md" />;
    }

    if (fileExtension === 'pdf') {
      return <iframe src={ipfsUrl} title="PDF Preview" width="100%" height="400px" style={{ border: 'none' }} />;
    }

    if (['txt', 'md'].includes(fileExtension)) {
      return <iframe src={ipfsUrl} title="Text Preview" width="100%" height="400px" style={{ border: 'none' }} />;
    }

    if (['mp4', 'webm'].includes(fileExtension)) {
      return (
        <video controls width="100%" height="400px">
          <source src={ipfsUrl} type={`video/${fileExtension}`} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (['mp3', 'wav'].includes(fileExtension)) {
      return (
        <audio controls style={{ width: '100%' }}>
          <source src={ipfsUrl} type={`audio/${fileExtension}`} />
          Your browser does not support the audio element.
        </audio>
      );
    }

    return (
      <VStack gap={2}>
        <Icon as={fileExtension === 'unknown' ? FaFile : FaFileAlt} boxSize={8} color={themeConfig.text} />
        <Text color={themeConfig.text}>
          Preview not available for {fileExtension.toUpperCase()} files. Please download to view.
        </Text>
      </VStack>
    );
  };

  // Render login screen if not connected
  if (!isConnected || !account) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg={theme === 'light' ? 'white' : '#0d1a2d'} color={themeConfig.text}>
        <VStack gap={4}>
          <Text fontSize="xl" fontFamily="'Poppins', sans-serif">Please connect your wallet to access the dashboard.</Text>
          <MotionButton
            bgGradient={themeConfig.gradient}
            color="white"
            size="lg"
            whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${themeConfig.secondary}` }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={connectWallet}
          >
            Connect Wallet
          </MotionButton>
        </VStack>
      </Box>
    );
  }

  // Main dashboard UI
  return (
    <Box position="relative" minH="100vh" overflow="hidden" pt="0">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: { color: { value: 'transparent' } },
          fpsLimit: 120,
          interactivity: {
            events: { onHover: { enable: true, mode: 'repulse' }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 } },
          },
          particles: {
            color: { value: themeConfig.particleColor },
            links: { color: themeConfig.particleColor, distance: 150, enable: true, opacity: 0.4, width: 1 },
            move: { enable: true, speed: 1.5, outModes: 'bounce' },
            number: { density: { enable: true, area: 800 }, value: 50 },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      />
      <MotionBox
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient={themeConfig.gradient}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        zIndex={0}
      />
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        bg={theme === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.7)'}
        backdropFilter="blur(15px)"
        color={themeConfig.text}
        p={{ base: 4, md: 8 }}
        position="relative"
        zIndex={1}
      >
        <Flex justify="flex-start" align="center" mb={2}>
          <MotionButton
            leftIcon={<ArrowBackIcon />}
            variant="ghost"
            color={themeConfig.text}
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            Back to Home
          </MotionButton>
        </Flex>
        <MotionBox
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          minH="calc(100vh - 80px)"
        >
          <VStack gap={6} align="stretch" maxW="1200px" mx="auto" bg={themeConfig.cardBg} backdropFilter="blur(15px)" borderRadius="2xl" p={{ base: 6, md: 10 }} boxShadow={`0 0 50px ${themeConfig.border}`}>
            <Heading
              size="xl"
              textAlign="center"
              fontFamily="'Poppins', sans-serif"
              bgGradient={themeConfig.gradient}
              bgClip="text"
            >
              Dashboard
            </Heading>
            <Flex justify="space-between" align="center" w="full" flexDir={{ base: 'column', md: 'row' }} gap={4}>
              <Text fontSize="lg" fontFamily="'Poppins', sans-serif">
                Connected as {account.slice(0, 6)}...{account.slice(-4)}
              </Text>
              <Flex gap={3}>
                <MotionButton
                  bgGradient="linear(to-r, red.500, pink.600)"
                  color="white"
                  size="sm"
                  onClick={handleDisconnectWallet}
                  whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(255, 0, 0, 0.8)' }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  borderRadius="full"
                  px={6}
                >
                  Disconnect Wallet
                </MotionButton>
              </Flex>
            </Flex>
            <Tabs variant="soft-rounded" colorScheme="teal">
              <TabList>
                <Tab fontFamily="'Poppins', sans-serif">File Operations</Tab>
                <Tab fontFamily="'Poppins', sans-serif">Settings <SettingsIcon ml={2} /></Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack gap={6} align="stretch">
                    <Heading size="md" fontFamily="'Poppins', sans-serif" color={themeConfig.text}>Upload File</Heading>
                    <FileUpload
                      onUploadSuccess={(file) => {
                        setUserFiles((prev) => [...prev, { ...file, version: 1, owner: account, isDeleted: false, sharedWith: [] }]);
                        toast({
                          title: 'File Uploaded',
                          description: (
                            <Flex align="center" gap={2}>
                              <Text>IPFS Hash: {file.fileHash}</Text>
                              <IconButton
                                aria-label="Copy hash"
                                icon={<CopyIcon />}
                                size="sm"
                                onClick={() => handleCopyHash(file.fileHash)}
                              />
                            </Flex>
                          ),
                          status: 'success',
                          duration: 5000,
                          isClosable: true,
                        });
                      }}
                    />
                    <Heading size="md" fontFamily="'Poppins', sans-serif" color={themeConfig.text}>Your Files</Heading>
                    {userFiles.length > 0 ? (
                      <Box overflowX="auto" borderRadius="md" border="1px solid" borderColor={themeConfig.border}>
                        <Table variant="simple" colorScheme="whiteAlpha">
                          <Thead>
                            <Tr>
                              <Th color={themeConfig.text}>File Name</Th>
                              <Th color={themeConfig.text}>Description</Th>
                              <Th color={themeConfig.text}>IPFS Hash</Th>
                              <Th color={themeConfig.text}>Version</Th>
                              <Th color={themeConfig.text}>Actions</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {userFiles.map((file, index) => (
                              <Tr key={index}>
                                <Td color={themeConfig.text}>{file.fileName}</Td>
                                <Td color={themeConfig.text}>{file.description}</Td>
                                <Td color={themeConfig.text} wordBreak="break-all" maxW="200px">{file.fileHash}</Td>
                                <Td color={themeConfig.text}>{file.version}</Td>
                                <Td>
                                  <Flex gap={2} wrap="wrap">
                                    <MotionButton
                                      size="sm"
                                      bgGradient={themeConfig.gradient}
                                      color="white"
                                      onClick={() => setSelectedFileHash(file.fileHash)}
                                      isDisabled={selectedFileHash === file.fileHash}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      {selectedFileHash === file.fileHash ? 'Selected' : 'Share'}
                                    </MotionButton>
                                    <MotionButton
                                      size="sm"
                                      bg="blue.500"
                                      color="white"
                                      leftIcon={<DownloadIcon />}
                                      onClick={() => handleDownloadFile(file.fileHash, file.fileName)}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      Download
                                    </MotionButton>
                                    <MotionButton
                                      size="sm"
                                      bg="purple.500"
                                      color="white"
                                      leftIcon={<ViewIcon />}
                                      onClick={() => handleViewFile(file.fileHash, file.fileName)}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      View
                                    </MotionButton>
                                    <MotionButton
                                      size="sm"
                                      bg="red.500"
                                      color="white"
                                      leftIcon={<DeleteIcon />}
                                      onClick={() => handleDeleteFile(file.fileName, file.version)}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      Delete
                                    </MotionButton>
                                    <MotionButton
                                      size="sm"
                                      bg="gray.500"
                                      color="white"
                                      leftIcon={<CopyIcon />}
                                      onClick={() => handleCopyHash(file.fileHash)}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      Copy Hash
                                    </MotionButton>
                                  </Flex>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Box>
                    ) : (
                      <Text color={themeConfig.text}>No files uploaded yet.</Text>
                    )}
                    {selectedFileHash && (
                      <VStack gap={4} align="stretch">
                        <Heading size="md" fontFamily="'Poppins', sans-serif" color={themeConfig.text}>Share File</Heading>
                        <Input
                          placeholder="Enter recipient address"
                          value={shareAddress}
                          onChange={(e) => setShareAddress(e.target.value)}
                          color={themeConfig.text}
                          borderColor={themeConfig.border}
                          _hover={{ borderColor: themeConfig.secondary }}
                          borderRadius="md"
                        />
                        <MotionButton
                          bgGradient={themeConfig.gradient}
                          color="white"
                          onClick={handleShareFile}
                          whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${themeConfig.secondary}` }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                        >
                          Share File
                        </MotionButton>
                      </VStack>
                    )}
                    <Heading size="md" fontFamily="'Poppins', sans-serif" color={themeConfig.text}>Files Shared with You</Heading>
                    {sharedFiles.length > 0 ? (
                      <Box overflowX="auto" borderRadius="md" border="1px solid" borderColor={themeConfig.border}>
                        <Table variant="simple" colorScheme="whiteAlpha">
                          <Thead>
                            <Tr>
                              <Th color={themeConfig.text}>File Name</Th>
                              <Th color={themeConfig.text}>Description</Th>
                              <Th color={themeConfig.text}>IPFS Hash</Th>
                              <Th color={themeConfig.text}>Owner</Th>
                              <Th color={themeConfig.text}>Actions</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {sharedFiles.map((file, index) => (
                              <Tr key={index}>
                                <Td color={themeConfig.text}>{file.fileName}</Td>
                                <Td color={themeConfig.text}>{file.description}</Td>
                                <Td color={themeConfig.text} wordBreak="break-all" maxW="200px">{file.fileHash}</Td>
                                <Td color={themeConfig.text}>{file.owner.slice(0, 6)}...{file.owner.slice(-4)}</Td>
                                <Td>
                                  <Flex gap={2}>
                                    <MotionButton
                                      size="sm"
                                      bg="blue.500"
                                      color="white"
                                      leftIcon={<DownloadIcon />}
                                      onClick={() => handleDownloadFile(file.fileHash, file.fileName)}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      Download
                                    </MotionButton>
                                    <MotionButton
                                      size="sm"
                                      bg="purple.500"
                                      color="white"
                                      leftIcon={<ViewIcon />}
                                      onClick={() => handleViewFile(file.fileHash, file.fileName)}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      View
                                    </MotionButton>
                                    <MotionButton
                                      size="sm"
                                      bg="gray.500"
                                      color="white"
                                      leftIcon={<CopyIcon />}
                                      onClick={() => handleCopyHash(file.fileHash)}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      Copy Hash
                                    </MotionButton>
                                  </Flex>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Box>
                    ) : (
                      <Text color={themeConfig.text}>No files shared with you yet.</Text>
                    )}
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack gap={4} align="stretch">
                    <Heading size="md" fontFamily="'Poppins', sans-serif" color={themeConfig.text}>Settings</Heading>
                    <Box bg={themeConfig.cardBg} p={4} borderRadius="md" border="1px solid" borderColor={themeConfig.border}>
                      <Text fontSize="lg" fontFamily="'Poppins', sans-serif" color={themeConfig.text}>Account Details</Text>
                      <Text color={themeConfig.text}>Address: {account.slice(0, 6)}...{account.slice(-4)}</Text>
                    </Box>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
            <IconButton
              aria-label="Toggle theme"
              icon={theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              onClick={toggleTheme}
              variant="ghost"
              color={themeConfig.primary}
              fontSize="xl"
              position="absolute"
              bottom="4"
              left="4"
              zIndex={2}
            />
          </VStack>
        </MotionBox>
        {previewFile && (
          <Modal isOpen={!!previewFile} onClose={() => setPreviewFile(null)} size="xl">
            <ModalOverlay backdropFilter="blur(10px)" />
            <ModalContent bg={theme === 'light' ? 'white' : 'gray.800'} color={themeConfig.text} borderRadius="xl">
              <ModalHeader fontFamily="'Poppins', sans-serif">Preview: {previewFile.fileName}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>{renderFilePreview(previewFile.hash)}</ModalBody>
              <ModalFooter>
                <MotionButton
                  bgGradient={themeConfig.gradient}
                  color="white"
                  mr={3}
                  onClick={() => handleDownloadFile(previewFile.hash, previewFile.fileName)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  Download
                </MotionButton>
                <MotionButton
                  variant="ghost"
                  color={themeConfig.text}
                  onClick={() => setPreviewFile(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  Close
                </MotionButton>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </MotionBox>
    </Box>
  );
};

export default Dashboard;