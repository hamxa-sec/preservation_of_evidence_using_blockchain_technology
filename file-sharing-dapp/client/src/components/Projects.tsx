import { useEffect, useState } from 'react';
import { Box, Heading, Text, SimpleGrid, VStack, Flex, IconButton, Link } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa';

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
const MotionCard = motion(Box);

const projects = [
  { title: 'Decentralized Storage', description: 'Secure file storage on IPFS.' },
  { title: 'Smart Contract Sharing', description: 'Share files via blockchain.' },
  { title: 'Web3 Authentication', description: 'Login with MetaMask.' },
];

const Projects: React.FC = () => {
  const { theme, themeConfig, toggleTheme } = useTheme();
  const [isNavVisible, setIsNavVisible] = useState(false);

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

  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const particlesLoaded = async (container?: any) => {
    return Promise.resolve();
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
          duration: 8,
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
              speed: 1.5,
              outModes: 'bounce' 
            },
            number: { density: { enable: true, area: 800 }, value: 50 },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 3 } },
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

      {/* Navbar */}
      <MotionBox
        position="fixed"
        top={0}
        left={0}
        right={0}
        bg={theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.2)'}
        backdropFilter="blur(12px)"
        zIndex={20}
        p={4}
        borderBottom="1px solid"
        borderColor={themeConfig.border}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: isNavVisible ? 1 : 0, y: isNavVisible ? 0 : -50 }}
        transition={{ duration: 0.3 }}
      >
        <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
          <Text fontSize="xl" fontWeight="bold" fontFamily="'Poppins', sans-serif" color={themeConfig.primary}>
            Evidia
          </Text>
          <Flex gap={4}>
            <IconButton
              aria-label="Toggle theme"
              icon={theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              onClick={toggleTheme}
              variant="ghost"
              color={themeConfig.primary}
              fontSize="xl"
            />
          </Flex>
        </Flex>
      </MotionBox>

      {/* Projects Section */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={8}
        pt="80px"
        position="relative"
        zIndex={2}
      >
        <VStack gap={12} align="stretch" maxW="1200px" mx="auto">
          <MotionBox
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Heading
              size="2xl"
              fontFamily="'Poppins', sans-serif"
              fontWeight="800"
              color="blackAlpha.900"
              textAlign="center"
            >
              Our Project
            </Heading>
          </MotionBox>
          
          <MotionBox
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Text fontSize="xl" textAlign="center" maxW="800px" mx="auto" color="blackAlpha.800">
              Explore the innovative projects at Evidia, designed to push the boundaries of decentralized technology. Evidia is a decentralized platform that harnesses the power of blockchain and the InterPlanetary File System (IPFS) to deliver secure, transparent, and efficient file sharing and storage solutions. By leveraging blockchain technology, Evidia ensures that users can send records to organizations with enhanced security and integrity, as each file is hashed and stored on the blockchain, creating an immutable record that verifies authenticity and prevents tampering. The integration of IPFS enables decentralized file storage, distributing data across a network of nodes to enhance accessibility, resilience, and privacy while eliminating reliance on centralized servers. This approach not only fosters trust through transparent data management but also empowers users with greater control over their shared records, making Evidia an ideal solution for secure and verifiable data exchange in various organizational contexts.
            </Text>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {projects.map((project, index) => (
              <MotionCard
                key={index}
                bg="white"
                borderRadius="xl"
                p={6}
                boxShadow="0 5px 20px rgba(0,0,0,0.05)"
                border="1px solid"
                borderColor="gray.100"
                textAlign="center"
                whileHover={{ 
                  y: -5,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, hover: { duration: 0.3 } }}
              >
                <Text fontSize="lg" fontWeight="600" mb={3} color={themeConfig.primary}>
                  {project.title}
                </Text>
                <Text color="gray.600">{project.description}</Text>
              </MotionCard>
            ))}
          </SimpleGrid>
        </VStack>
      </MotionBox>

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
                  { icon: FaGithub, url: 'https://github.com/' },
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
                <Link href="#">Home</Link>
                <Link href="#">Features</Link>
                <Link href="#">Team</Link>
                <Link href="#">Contact</Link>
              </VStack>
            </Box>

            <Box flex={1}>
              <Text fontWeight="600" mb={4}>University</Text>
              <Text>
                The Islamia University of Bahawalpur
                <br />
                Department of Information and Communication Engineering 
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

export default Projects;