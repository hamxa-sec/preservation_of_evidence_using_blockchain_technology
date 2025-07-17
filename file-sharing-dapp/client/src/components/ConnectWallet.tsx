import { Box, Button, Text, useToast, Icon } from '@chakra-ui/react'; // Add Icon import
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiLink } from 'react-icons/fi';
import { useWeb3 } from '../context/Web3Context';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const ConnectWallet: React.FC = () => {
  const { connectWallet, account } = useWeb3();
  const navigate = useNavigate();
  const toast = useToast();

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast({
        title: 'Wallet Connected',
        description: `Connected as ${account}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Wallet connection failed:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect wallet. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      p={4}
    >
      <MotionButton
        leftIcon={<Icon as={FiLink} w={5} h={5} />} // Wrap FiLink in Icon
        bgGradient="linear(to-r, cyan.500, purple.600)"
        color="white"
        onClick={handleConnect}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        _hover={{ bgGradient: 'linear(to-r, cyan.400, purple.500)' }}
      >
        {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
      </MotionButton>
    </MotionBox>
  );
};

export default ConnectWallet;
