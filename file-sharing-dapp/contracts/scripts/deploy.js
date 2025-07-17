const hre = require("hardhat");
   const fs = require("fs");
   const path = require("path");

   async function main() {
     const [deployer] = await hre.ethers.getSigners();

     console.log("Deploying contracts with the account:", deployer.address);



     // Deploy FileSharing
     const FileSharing = await hre.ethers.getContractFactory("FileSharing");
     const fileSharing = await FileSharing.deploy();
     await fileSharing.waitForDeployment();
     const fileSharingAddress = await fileSharing.getAddress();
     console.log("FileSharing deployed to:", fileSharingAddress);


     // Save contract addresses to a file for React app integration
     fs.writeFileSync(
       "../client/src/contract-addresses.json",
       JSON.stringify(
         {
           
           FileSharing: fileSharingAddress,
           
         },
         null,
         2
       )
     );
     console.log("Contract addresses saved to contract-addresses.json");

     // Copy contract artifacts to src/ directory
     const artifactsPath = path.join(__dirname, "../artifacts/contracts");
     const srcPath = path.join(__dirname, "../client/src");

     const contracts = ["UserManagement", "FileSharing", "AdminControl"];
     for (const contract of contracts) {
       const artifactFile = path.join(artifactsPath, `${contract}.sol`, `${contract}.json`);
       const destinationFile = path.join(srcPath, `${contract}.json`);
       if (fs.existsSync(artifactFile)) {
         fs.copyFileSync(artifactFile, destinationFile);
         console.log(`Copied ${contract}.json to src/`);
       } else {
         console.error(`Artifact for ${contract} not found at ${artifactFile}`);
       }
     }
   }

   main()
     .then(() => process.exit(0))
     .catch((error) => {
       console.error(error);
       process.exit(1);
     });
