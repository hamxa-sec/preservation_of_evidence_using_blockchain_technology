import { Box, Text, Flex } from '@chakra-ui/react';

const Footer: React.FC = () => {
  return (
    <Box bg="#333D79ff" color="white" p={4} mt="auto" textAlign="center">
      <Flex justify="center" align="center" direction="column">
        <Text>© {new Date().getFullYear()} Evidia. All rights reserved.</Text>
        <Text mt={2}>Contact: support@evidia.com</Text>
      </Flex>
    </Box>
  );
};

export default Footer;
