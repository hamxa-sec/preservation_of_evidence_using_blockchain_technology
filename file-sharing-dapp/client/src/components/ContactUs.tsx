import { Box, Heading, Text, VStack, FormControl, FormLabel, Input, Textarea, Button, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const ContactUs: React.FC = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendMail = () => {
    const { name, email, message } = formData;
    if (!name || !email || !message) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const subject = encodeURIComponent(`Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
    const mailtoLink = `mailto:support@evidia.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  return (
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
      bgGradient="linear(to-br, #e6f0fa, #ffffff)"
    >
      <VStack
        w="full"
        maxW="600px"
        spacing={8}
        p={10}
        bg="white"
        borderRadius="xl"
        boxShadow="0 10px 30px rgba(0, 0, 0, 0.1)"
        border="1px solid"
        borderColor="#e0e7ff"
      >
        <Heading
          size="2xl"
          fontFamily="'Poppins', sans-serif"
          color="#2b6777"
          textAlign="center"
          textShadow="0 1px 3px rgba(0, 0, 0, 0.1)"
        >
          Contact Us
        </Heading>
        <Text fontSize="lg" color="gray.600" textAlign="center" maxW="500px">
          We'd love to hear from you! Fill out the form below to get in touch.
        </Text>

        <VStack w="full" spacing={6}>
          <FormControl id="name" isRequired>
            <FormLabel color="whiteAlpha.700">Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              bg="gray.50"
              borderColor="#52ab98"
              _hover={{ borderColor: '#2b6777' }}
              _focus={{ borderColor: '#2b6777', boxShadow: '0 0 0 1px #2b6777' }}
            />
          </FormControl>

          <FormControl id="email" isRequired>
            <FormLabel color="whiteAlpha.700">Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              bg="gray.50"
              borderColor="#52ab98"
              _hover={{ borderColor: '#2b6777' }}
              _focus={{ borderColor: '#2b6777', boxShadow: '0 0 0 1px #2b6777' }}
            />
          </FormControl>

          <FormControl id="message" isRequired>
            <FormLabel color="blackAlpha.700">Message</FormLabel>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message here"
              bg="gray.50"
              borderColor="#52ab98"
              _hover={{ borderColor: '#2b6777' }}
              _focus={{ borderColor: '#2b6777', boxShadow: '0 0 0 1px #2b6777' }}
              rows={5}
            />
          </FormControl>

          <MotionButton
            bg="#2b6777"
            color="white"
            size="lg"
            px={8}
            fontSize="lg"
            fontWeight="600"
            onClick={handleSendMail}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 15px rgba(43, 103, 119, 0.6)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            borderRadius="full"
          >
            Send Mail
          </MotionButton>
        </VStack>
      </VStack>
    </MotionBox>
  );
};

export default ContactUs;