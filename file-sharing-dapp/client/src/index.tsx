import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import { Web3Provider } from './context/Web3Context';

ReactDOM.render(
  <ChakraProvider>
    <Web3Provider>
      <App />
    </Web3Provider>
  </ChakraProvider>,
  document.getElementById('root')
);
