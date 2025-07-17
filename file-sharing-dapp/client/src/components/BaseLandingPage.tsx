import { useEffect, useState } from 'react';
import { Box, Heading, Text, VStack, Button, useToast, SimpleGrid, Flex, Icon, Link, IconButton } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { useWeb3 } from '../context/Web3Context';
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa';
import { title } from 'process';

// Custom hook for multiple themes
const useTheme = () => {
  const [theme, setTheme] = useState('light');
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
    const currentIndex = themes.findIndex((t) => t.name === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].name);
  };

  return { theme, themeConfig: themes.find((t) => t.name === theme)!, toggleTheme };
};

const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionCard = motion(Box);
const MotionText = motion(Text);

const BaseLandingPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { connectWallet, account, isConnected } = useWeb3();
  const { theme, themeConfig } = useTheme();

  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const particlesLoaded = async (container?: any) => {
    return Promise.resolve();
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      if (isConnected && account) {
        toast({
          title: 'Wallet Connected',
          description: `Connected as ${account.slice(0, 6)}...${account.slice(-4)}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/dashboard');
      }
    } catch (error) {
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
    <Box position="relative" minH="100vh" bg="white" color={themeConfig.text}>
      {/* Animated Gradient Background */}
      <MotionBox
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="linear(to-br, #2b6777, #52ab98, #c8d8e4)"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        zIndex={0}
      />

      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: { color: { value: 'transparent' } },
          fpsLimit: 120,
          interactivity: {
            events: { 
              onHover: { enable: true, mode: 'repulse' },
              resize: true 
            },
            modes: { repulse: { distance: 100, duration: 0.4 } },
          },
          particles: {
            color: { value: themeConfig.particleColor },
            links: { 
              color: themeConfig.particleColor, 
              distance: 150, 
              enable: true, 
              opacity: 0.4, 
              width: 1 
            },
            move: { 
              enable: true, 
              speed: 3, // Increased speed for more dynamic effect
              outModes: 'bounce' 
            },
            number: { density: { enable: true, area: 800 }, value: 70 }, // Increased particle count
            opacity: { value: 0.6 },
            size: { value: { min: 1, max: 4 } }, // Slightly larger particles
          },
          detectRetina: true,
        }}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 1 
        }}
      />

      {/* Hero Section */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={8}
        pt="80px"
        position="relative"
        zIndex={2}
      >
        <VStack gap={6} textAlign="center" maxW="1000px">
          <MotionBox
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Heading
              size="3xl"
              fontFamily="'Poppins', sans-serif"
              fontWeight="800"
              color="blackAlpha.1100"
              lineHeight="1.2"
              mb={4}
              textShadow="0 2px 4px rgba(8, 6, 6, 0.2)" // Added shadow for readability
            >
              Welcome to Evidia
            </Heading>
            <MotionText
              fontSize="xl"
              color={themeConfig.secondary}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: [1, 1.05, 1] }} // Added subtle pulsing
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            >
              Your Gateway to Decentralized File Sharing
            </MotionText>
          </MotionBox>
          
          <MotionBox
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Text fontSize="2xl"
              maxW="700px"
              color="whiteAlpha.900"
              mb={8}
              fontWeight="530"
              textShadow="0 1px 2px rgba(0, 0, 0, 0.1)" // Added shadow for readability
            >
              Evidia is your decentralized platform for secure file sharing and storage, powered by blockchain and IPFS technology.
            </Text>
          </MotionBox>
        </VStack>
      </MotionBox>

      {/* Content Sections */}
      <Box position="relative" zIndex={3} bg="white" pt={20} pb={32}>
        <VStack gap={20} align="stretch" maxW="1200px" mx="auto" px={8}>
          {/* Features Section */}
          <VStack gap={12} textAlign="center">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Text color={themeConfig.secondary} fontWeight="600" mb={2} fontSize="lg">
                WHY CHOOSE EVIDIA
              </Text>
              <Heading size="2xl"
                fontFamily="'Poppins', sans-serif"
                color={themeConfig.primary}
                textShadow="0 1px 3px rgba(0, 0, 0, 0.1)"
              >
                Secure Blockchain Solutions
              </Heading>
            </MotionBox>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              {[
                {
                  title: "End-to-End Encryption",
                  description: "Military-grade encryption ensures your files remain private and secure at all times.",
                  icon: "🔒"
                },
                {
                  title: "Decentralized Storage",
                  description: "Files distributed across IPFS network for maximum availability and redundancy.",
                  icon: "🌐"
                },
                {
                  title: "Smart Contract Access",
                  description: "Granular permissions controlled by Ethereum smart contracts.",
                  icon: "📜"
                },
                {
                  title:"Integrity ",
                  description:  "Store Hashes for Maintain Integrity. ",
                  icon:  "🔒",
                },
                {
                  title:"Temper proof Storage",
                  description:"All file store on blockchain.",
                  icon:"🛡️",
                },
                {
                  title:"Metamask",
                  description:"Allow transmit Evidence or Data via Metamask.",
                  icon:"🖧",
                },
              ].map((feature, index) => (
                <MotionCard
                  key={index}
                  bg={themeConfig.cardBg}
                  borderRadius="xl"
                  p={8}
                  boxShadow="0 10px 30px rgba(82, 171, 152, 0.1)"
                  border="1px solid"
                  borderColor={themeConfig.border}
                  whileHover={{ 
                    y: -5,
                    boxShadow: '0 15px 40px rgba(82, 171, 152, 0.3)',
                    scale: 1.02,
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05, hover: { duration: 0.2 } }}
                >
                  <Text fontSize="4xl" mb={4} color={themeConfig.primary}>{feature.icon}</Text>
                  <Text fontSize="xl"
                    fontWeight="700"
                    mb={3}
                    color={themeConfig.primary}
                  >
                    {feature.title}
                  </Text>
                  <Text color="gray.600" fontSize="md">
                    {feature.description}
                  </Text>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Team Section */}
          <VStack gap={12} textAlign="center">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Text color={themeConfig.secondary} fontWeight="600" mb={2} fontSize="lg">
                OUR TEAM
              </Text>
              <Heading size="2xl"
                fontFamily="'Poppins', sans-serif"
                color={themeConfig.primary}
                textShadow="0 1px 3px rgba(0, 0, 0, 0.1)"
              >
                Meet The Developers
              </Heading>
            </MotionBox>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {[
                {
                  name: "Prof. Dr. Muhammad Ali Qureshi",
                  role: "Supervisor",
                  description: "Academic Guidance & Mentor.His supervision ensures that research initiatives, such as those involving decentralized platforms like Evidia"
                },
                {
                  name: "Ali Zulqarnain",
                  role: "Blockchain Developer",
                  description: "Smart contracts & IPFS integration"
                },
                {
                  name: "Hamza Qasim",
                  role: "Frontend Developer",
                  description: "Frontend Design and implementation"
                },
                {
                  name: "Mahjbeen",
                  role: "Documentation",
                  description: "Research Work"
                },
              ].map((member, index) => (
                <MotionCard
                  key={index}
                  bg={themeConfig.cardBg}
                  borderRadius="xl"
                  p={6}
                  boxShadow="0 5px 20px rgba(0,0,0,0.05)"
                  border="1px solid"
                  borderColor={themeConfig.border}
                  textAlign="center"
                  whileHover={{ 
                    y: -5,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    scale: 1.02,
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05, hover: { duration: 0.2 } }}
                >
                  <Box 
                    w="120px" 
                    h="120px" 
                    mx="auto" 
                    mb={4} 
                    borderRadius="full" 
                    bgGradient={`linear(to-br, ${themeConfig.secondary}, ${themeConfig.primary})`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    fontSize="3xl"
                    fontWeight="bold"
                    boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
                  >
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </Box>
                  <Text fontSize="lg" fontWeight="600" mb={1} color={themeConfig.primary}>
                    {member.name}
                  </Text>
                  <Text color={themeConfig.secondary} mb={3} fontSize="sm" fontWeight="500">
                    {member.role}
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    {member.description}
                  </Text>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>

          {/* CTA Section */}
          <MotionBox
            bgGradient={`linear(to-r, ${themeConfig.primary}, ${themeConfig.secondary})`}
            borderRadius="2xl"
            p={12}
            textAlign="center"
            color="white"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Heading size="2xl"
              fontFamily="'Poppins', sans-serif"
              mb={6}
              textShadow="0 2px 4px rgba(0, 0, 0, 0.2)"
            >
              Ready to Secure Your Files?
            </Heading>
            <Text fontSize="xl"
              maxW="700px"
              mx="auto"
              mb={10}
              fontWeight="500"
              textShadow="0 1px 2px rgba(0, 0, 0, 0.1)"
            >
              Join the decentralized revolution and take control of your data today  :)
            </Text>
            <MotionButton
              bg="white"
              color={themeConfig.primary}
              size="lg"
              px={12}
              fontSize="lg"
              fontWeight="600"
              onClick={() => navigate('/dashboard')}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 0 20px ${themeConfig.secondary}`,
              }}
              whileTap={{ scale: 0.98 }}
              animate={{ scale: [1, 1.02, 1] }} // Added pulsing animation
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              borderRadius="full"
            >
              Get Started
            </MotionButton>
          </MotionBox>
        </VStack>
      </Box>

      {/* Footer */}
      <Box 
        position="relative" 
        zIndex={4} 
        bg={themeConfig.primary} 
        color="white" 
        pt={16} 
        pb={8}
      >
        <Box maxW="1200px" mx="auto" px={8}>
          <Flex direction={{ base: 'column', md: 'row' }} gap={12} mb={12}>
            <Box flex={1}>
              <Text fontSize="2xl" fontWeight="bold" mb={4}>Evidia</Text>
              <Text mb={4}>
                Decentralized file storage powered by blockchain technology.
              </Text>
              <Flex gap={4}>
                {[
                  { icon: FaGithub, url: '#' },
                  { icon: FaTwitter, url: '#' },
                  { icon: FaLinkedin, url: '#' },
                  { icon: FaDiscord, url: '#' }
                ].map((social, i) => (
                  <IconButton
                    key={i}
                    as="a"
                    href={social.url}
                    aria-label="Social link"
                    icon={<social.icon />}
                    variant="ghost"
                    color="white"
                    fontSize="xl"
                    _hover={{ bg: 'whiteAlpha.200' }}
                  />
                ))}
              </Flex>
            </Box>

            <Box flex={1}>
              <Text fontWeight="600" mb={4}>Quick Links</Text>
              <VStack align="start" spacing={3}>
                <Link href="/">Home</Link>
                <Link href="/about">About Us</Link>
                <Link href="/projects">Projects</Link>
                <Link href="/contact">Contact Us</Link>
              </VStack>
            </Box>

            <Box flex={1}>
              <Text fontWeight="600" mb={4}>University</Text>
              <Text>
                The Islamia University of Bahawalpur
                <br />
                Department of Information & Communication Engineering.
              </Text>
            </Box>
          </Flex>

          <Box 
            borderTop="1px solid" 
            borderColor="whiteAlpha.300" 
            pt={8} 
            textAlign="center"
          >
            <Text>
              © {new Date().getFullYear()} Evidia. All rights reserved.
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BaseLandingPage;