# preservation_of_evidence_using_blockchain_technology
EvidenceChain Preserving Digital Evidence with Blockchain Technology EvidenceChain is a blockchain-based system designed to securely preserve digital evidence for forensic investigations. Leveraging Ethereum smart contracts, IPFS for decentralized storage, a React-based frontend, and MetaMask for secure transactions, EvidenceChain ensures transparency, immutability, and usability in managing digital evidence. Deployed on the Sepolia testnet using Hardhat, it achieves a 98.5% transaction success rate and a 4.7/5 usability rating, making it a robust solution for forensic professionals. Table of Contents

Features System Architecture Installation Usage Technical Details Testing and Performance Contributing License Acknowledgments Contact

Features

Immutable Evidence Storage: Stores SHA-256 hashed evidence metadata on Ethereum, ensuring tamper-proof records. Decentralized Storage: Utilizes IPFS via Pinata for scalable, secure, and decentralized file storage (up to 100 MB files). User-Friendly Interface: Built with React for intuitive evidence management, accessible to non-technical users. Secure Transactions: Integrates MetaMask for authentication and transaction signing on the Sepolia testnet. Open Source: Released under the MIT License to encourage community contributions and transparency. High Performance: Achieves 98.5% transaction success rate and 2.1-second upload times for 10 MB files.

System Architecture EvidenceChain comprises four core layers:

Blockchain Layer: Ethereum smart contracts (Solidity v0.8.0) manage evidence metadata, chain of custody, and access permissions. Storage Layer: IPFS, integrated via Pinata API, stores evidence files decentrally, with content-addressed hashes ensuring integrity. Frontend Layer: A React (v17) interface with ethers.js (v5) enables users to upload, retrieve, verify, and delete evidence. Transaction Layer: MetaMask (v10.8.1) handles user authentication and secure transaction signing.

Installation Follow these steps to set up EvidenceChain locally: Prerequisites

8 GB RAM, 256 GB SSD Node.js v16.15.0 MetaMask browser extension Git Hardhat v2.9.3

Steps

Clone the Repository:git clone https://github.com/alizulqarnain5225/preservation_of_evidence_using_blockchain_technology

cd preservation_of_evidence_using_blockchain_technology

Install Dependencies:npm install

Configure Environment: Create a .env file in the root directory. Add the following:PINATA_API_KEY=your_pinata_api_key PINATA_SECRET_API_KEY=your_pinata_secret_key INFURA_API_KEY=your_infura_api_key SEPOLIA_PRIVATE_KEY=your_wallet_private_key

Obtain API keys from Pinata and Infura.

Deploy Smart Contracts:npx hardhat run scripts/Deploy.js

Start the Frontend:npm start

Connect MetaMask: Configure MetaMask to use the Sepolia testnet. Import your wallet using the private key.

Usage

Access the Platform: Open the application in a browser (e.g., http://localhost:3000). Connect MetaMask to authenticate.

Upload Evidence: Select a file (up to 100 MB) and add metadata (e.g., case ID, description). The file is uploaded to IPFS via Pinata, and its hash is stored on Ethereum.

Retrieve and Verify: Query evidence by hash to retrieve metadata and verify integrity.

Manage Evidence: Copy or delete evidence records via the smart contract, with all actions logged immutably.

Technical Details

Smart Contracts: Written in Solidity v0.8.0, deployed with Hardhat on Sepolia. Achieves 100% test coverage. IPFS Integration: Uses Pinata API for reliable file pinning, with retry logic for uploads. Frontend: Built with React v17, ethers.js v5, and Tailwind CSS for responsive design. Environment: OS: Windows 11 CPU: Intel i7-10700K RAM: 32 GB Tools: Node.js v16.15.0, VS Code v1.68, Ganache v7.0, Infura

Gas Costs: Average 50,000 gas per transaction, optimized for cost efficiency.

Testing and Performance EvidenceChain was rigorously tested over one month with 1,000 transactions and 60 users:

Unit Testing: 100% pass rate for smart contract logic. Integration Testing: 95.5% success rate for end-to-end workflows. User Acceptance Testing (UAT): 94% satisfaction rate among forensic professionals. Performance Metrics: Transaction Success Rate: 98.5% IPFS Upload (10 MB): 2.1 seconds Frontend Response Time: 1.2 seconds

Module Metric Value

Contract Success Rate 98.5%

IPFS Upload (10 MB) 2.1 s

Frontend Response Time 1.2 s

Contributing We welcome contributions from the community! To contribute:

Fork the repository. Create a new branch (git checkout -b feature/your-feature).

Commit your changes (git commit -m 'Add your feature').

Push to the branch (git push origin feature/your-feature).

Open a Pull Request.

Please follow the Code of Conduct and ensure all tests pass before submitting. License EvidenceChain is released under the MIT License. Acknowledgments

Contact For inquiries, please contact: GitHub Issues: EvidenceChain Issues
