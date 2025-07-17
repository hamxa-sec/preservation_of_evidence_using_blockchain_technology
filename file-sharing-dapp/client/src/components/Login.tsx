import { Box, Button, Heading, VStack, Text, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useWeb3 } from '../context/Web3Context';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const Login: React.FC = () => {
  const { account, isConnected, connectWallet, userManagementContract } = useWeb3();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (isConnected && account && userManagementContract) {
        try {
          const isRegistered = await userManagementContract.isRegistered(account);
          if (isRegistered) {
            toast({
              title: 'Login Successful',
              description: 'You are already registered. Redirecting to dashboard...',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            navigate('/dashboard');
          } else {
            toast({
              title: 'User Not Registered',
              description: 'Please sign up first.',
              status: 'warning',
              duration: 3000,
              isClosable: true,
            });
            navigate('/signup');
          }
        } catch (error) {
          console.error('Error checking user registration:', error);
          toast({
            title: 'Error',
            description: 'Failed to check registration status. Please try again.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };

    checkUserRegistration();
  }, [isConnected, account, userManagementContract, navigate, toast]);

  const handleLogin = async () => {
    if (!isConnected) {
      try {
        await connectWallet();
      } catch (error) {
        toast({
          title: 'Connection Failed',
          description: 'Failed to connect wallet. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      minH="100vh"
      bgGradient="linear(to-br, teal.900, purple.900)"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={8}
    >
      <VStack gap={6} textAlign="center" bg="rgba(255, 255, 255, 0.05)" p={8} borderRadius="xl" boxShadow="lg">
        <Heading size="lg">Login to Evidia</Heading>
        <Text>Connect your MetaMask wallet to log in.</Text>
        <MotionButton
          bgGradient="linear(to-r, cyan.500, purple.600)"
          color="white"
          size="lg"
          onClick={handleLogin}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          borderRadius="full"
          px={8}
          isDisabled={isConnected}
        >
          {isConnected ? 'Wallet Connected' : 'Connect MetaMask'}
        </MotionButton>
      </VStack>
    </MotionBox>
  );
};

export default Login;
