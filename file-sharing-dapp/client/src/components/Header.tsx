import { Box, Button, Flex, useToast } from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const Header: React.FC = () => {
  const { account, isConnected, connectWallet } = useWeb3();
  const navigate = useNavigate();
  const toast = useToast();
  const [isNavVisible, setIsNavVisible] = useState(false);

  // Theme configuration for colors (matching BaseLandingPage)
  const themeConfig = {
    primary: '#2b6777', // Same as light theme in BaseLandingPage
    secondary: '#52ab98',
  };

  // Mouse movement handler to show/hide navbar
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (event.clientY < 100) {
        setIsNavVisible(true);
      } else {
        setIsNavVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleConnectWallet = async () => {
    if (!isConnected) {
      try {
        await connectWallet();
        toast({
          title: 'Wallet Connected',
          description: `Connected as ${account?.slice(0, 6)}...${account?.slice(-4)}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/dashboard');
      } catch (error) {
        toast({
          title: 'Connection Failed',
          description: 'Failed to connect wallet. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <MotionBox
      bg="gray.800"
      px={4}
      py={3}
      boxShadow="md"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: isNavVisible ? 1 : 0, y: isNavVisible ? 0 : -50 }}
      transition={{ duration: 0.3 }}
    >
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        <RouterLink to="/">
          <Box
            fontSize="xl"
            fontWeight="bold"
            fontFamily="'Poppins', sans-serif"
            color={themeConfig.primary}
          >
            Evidia
          </Box>
        </RouterLink>
        <Flex align="center" gap={3}>
          <MotionButton
            variant="outline"
            colorScheme="teal"
            size="md"
            fontFamily="'Poppins', sans-serif"
            fontWeight="600"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            borderRadius="full"
          >
            Home
          </MotionButton>
          <MotionButton
            variant="outline"
            colorScheme="teal"
            size="md"
            fontFamily="'Poppins', sans-serif"
            fontWeight="600"
            onClick={() => navigate('/about')}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            borderRadius="full"
          >
            About Us
          </MotionButton>
          <MotionButton
            variant="outline"
            colorScheme="teal"
            size="md"
            fontFamily="'Poppins', sans-serif"
            fontWeight="600"
            onClick={() => navigate('/projects')}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            borderRadius="full"
          >
            Projects
          </MotionButton>
          <MotionButton
            variant="outline"
            colorScheme="teal"
            size="md"
            fontFamily="'Poppins', sans-serif"
            fontWeight="600"
            onClick={() => navigate('/contact')}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            borderRadius="full"
          >
            Contact Us
          </MotionButton>
          <MotionButton
            colorScheme="teal"
            size="md"
            fontFamily="'Poppins', sans-serif"
            fontWeight="600"
            onClick={handleConnectWallet}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            borderRadius="full"
            px={6}
          >
            {isConnected ? 'Go to Dashboard' : 'Connect Wallet'}
          </MotionButton>
        </Flex>
      </Flex>
    </MotionBox>
  );
};

export default Header;