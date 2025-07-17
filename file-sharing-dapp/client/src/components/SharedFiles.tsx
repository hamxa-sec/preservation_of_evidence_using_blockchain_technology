import { useState, useEffect } from 'react';
import { Box, VStack, Text, TableContainer, Table, Thead, Tbody, Tr, Th, Td, Button, Icon } from '@chakra-ui/react';
import { FiDownload, FiTrash } from 'react-icons/fi';
import { useWeb3 } from '../context/Web3Context';

const SharedFiles: React.FC = () => {
  const { fileSharingContract, account } = useWeb3();
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const fetchSharedFiles = async () => {
      if (fileSharingContract && account) {
        const sharedFiles = await fileSharingContract.getSharedFiles(account);
        setFiles(sharedFiles);
      }
    };
    fetchSharedFiles();
  }, [fileSharingContract, account]);

  const handleDelete = async (hash: string) => {
    if (fileSharingContract && account) {
      const tx = await fileSharingContract.deleteFile(hash);
      await tx.wait();
      setFiles(files.filter((h) => h !== hash));
    }
  };

  return (
    <Box p={8}>
      <Text fontSize="xl" mb={4}>Shared Files</Text>
      {files.length > 0 ? (
        <TableContainer>
          <Table variant="simple" colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th color="white">File Name</Th>
                <Th color="white">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {files.map((file) => (
                <Tr key={file}>
                  <Td color="white">{file.slice(0, 10)}...</Td>
                  <Td>
                    <Button
                      size="sm"
                      onClick={() => window.open(`https://ipfs.io/ipfs/${file}`, '_blank')}
                      colorScheme="cyan"
                      mr={2}
                      leftIcon={<Icon as={FiDownload} />}
                    >
                      Download
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(file)}
                      leftIcon={<Icon as={FiTrash} />}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Text>No shared files available.</Text>
      )}
    </Box>
  );
};

export default SharedFiles;
