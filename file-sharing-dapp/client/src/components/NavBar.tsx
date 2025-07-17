import { Box, Flex, Button, Text, IconButton } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

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

const Navbar: React.FC = () => {
  const { theme, themeConfig, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <MotionBox
      bg={theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.2)'}
      backdropFilter="blur(12px)"
      px={4}
      py={2}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      borderBottom="1px solid"
      borderColor={themeConfig.border}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        <Text
          fontSize="xl"
          fontWeight="bold"
          fontFamily="'Poppins', sans-serif"
          color={themeConfig.primary}
          onClick={() => navigate('/')}
          cursor="pointer"
        >
          Evidia
        </Text>
        <Flex align="center" gap={4}>
          <MotionButton
            variant="link"
            color={themeConfig.text}
            fontFamily="'Poppins', sans-serif"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate('/about')}
          >
            About Us
          </MotionButton>
          <MotionButton
            variant="link"
            color={themeConfig.text}
            fontFamily="'Poppins', sans-serif"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate('/projects')}
          >
            Project
          </MotionButton>
          <MotionButton
            variant="link"
            color={themeConfig.text}
            fontFamily="'Poppins', sans-serif"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate('/contact')}
          >
            Contact Us
          </MotionButton>
          <MotionButton
            bgGradient={themeConfig.gradient}
            color="white"
            size="sm"
            fontFamily="'Poppins', sans-serif"
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(82, 171, 152, 0.8)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </MotionButton>
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
  );
};

export default Navbar;