// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FileSharing {
    struct File {
        string fileName;
        string fileHash;
        string description;
        uint256 version;
        address owner;
        bool isDeleted;
        address[] sharedWith;
    }

    mapping(address => File[]) private userFiles;
    mapping(string => bool) private fileExists;

    event FileUploaded(address indexed owner, string fileHash, string fileName);
    event FileShared(address indexed owner, string fileHash, address indexed recipient);
    event FileDeleted(address indexed owner, string fileHash);

    modifier onlyRegistered() {
        require(isRegistered(msg.sender), "User not registered");
        _;
    }

    function isRegistered(address /* user */) public pure returns (bool) {
        // Placeholder: Integrate with UserManagement in production
        return true; // Assume all connected addresses are registered for now
    }

    function uploadFile(string memory fileHash, string memory fileName, string memory description) public onlyRegistered {
        require(!fileExists[fileHash], "File already exists");
        File storage newFile = userFiles[msg.sender].push();
        newFile.fileName = fileName;
        newFile.fileHash = fileHash;
        newFile.description = description;
        newFile.version = userFiles[msg.sender].length;
        newFile.owner = msg.sender;
        newFile.isDeleted = false;
        fileExists[fileHash] = true;
        emit FileUploaded(msg.sender, fileHash, fileName);
    }

    function shareFile(string memory fileHash, address recipient) public onlyRegistered {
        require(fileExists[fileHash], "File does not exist");
        for (uint i = 0; i < userFiles[msg.sender].length; i++) {
            if (keccak256(abi.encodePacked(userFiles[msg.sender][i].fileHash)) == keccak256(abi.encodePacked(fileHash)) && !userFiles[msg.sender][i].isDeleted) {
                for (uint j = 0; j < userFiles[msg.sender][i].sharedWith.length; j++) {
                    if (userFiles[msg.sender][i].sharedWith[j] == recipient) {
                        revert("File already shared with this address");
                    }
                }
                userFiles[msg.sender][i].sharedWith.push(recipient);
                emit FileShared(msg.sender, fileHash, recipient);
                return;
            }
        }
        revert("File not found or deleted");
    }

    function deleteFile(string memory fileName, uint256 version) public onlyRegistered {
        for (uint i = 0; i < userFiles[msg.sender].length; i++) {
            if (keccak256(abi.encodePacked(userFiles[msg.sender][i].fileName)) == keccak256(abi.encodePacked(fileName)) && userFiles[msg.sender][i].version == version) {
                userFiles[msg.sender][i].isDeleted = true;
                emit FileDeleted(msg.sender, userFiles[msg.sender][i].fileHash);
                return;
            }
        }
        revert("File not found");
    }

    function getUserFiles(address user) public view onlyRegistered returns (File[] memory) {
        uint256 validCount = 0;
        for (uint i = 0; i < userFiles[user].length; i++) {
            if (!userFiles[user][i].isDeleted) validCount++;
        }
        File[] memory validFiles = new File[](validCount);
        uint256 index = 0;
        for (uint i = 0; i < userFiles[user].length; i++) {
            if (!userFiles[user][i].isDeleted) {
                validFiles[index] = userFiles[user][i];
                index++;
            }
        }
        return validFiles;
    }

    function getSharedFiles(address user) public view onlyRegistered returns (File[] memory) {
        uint256 totalFiles = 0;
        for (uint i = 0; i < userFiles[msg.sender].length; i++) {
            for (uint j = 0; j < userFiles[msg.sender][i].sharedWith.length; j++) {
                if (userFiles[msg.sender][i].sharedWith[j] == user && !userFiles[msg.sender][i].isDeleted) {
                    totalFiles++;
                }
            }
        }
        File[] memory sharedFiles = new File[](totalFiles);
        uint256 index = 0;
        for (uint i = 0; i < userFiles[msg.sender].length; i++) {
            for (uint j = 0; j < userFiles[msg.sender][i].sharedWith.length; j++) {
                if (userFiles[msg.sender][i].sharedWith[j] == user && !userFiles[msg.sender][i].isDeleted) {
                    sharedFiles[index] = userFiles[msg.sender][i];
                    index++;
                }
            }
        }
        return sharedFiles;
    }

    function _getAllFiles() internal view returns (File[] memory) {
        uint256 totalFiles = 0;
        for (uint i = 0; i < userFiles[msg.sender].length; i++) {
            if (!userFiles[msg.sender][i].isDeleted) totalFiles++;
        }
        File[] memory allFiles = new File[](totalFiles);
        uint256 index = 0;
        for (uint i = 0; i < userFiles[msg.sender].length; i++) {
            if (!userFiles[msg.sender][i].isDeleted) {
                allFiles[index] = userFiles[msg.sender][i];
                index++;
            }
        }
        return allFiles;
    }

    function isFileSharedWith(string memory fileHash, address user) public view onlyRegistered returns (bool) {
        for (uint i = 0; i < userFiles[msg.sender].length; i++) {
            if (keccak256(abi.encodePacked(userFiles[msg.sender][i].fileHash)) == keccak256(abi.encodePacked(fileHash)) && !userFiles[msg.sender][i].isDeleted) {
                for (uint j = 0; j < userFiles[msg.sender][i].sharedWith.length; j++) {
                    if (userFiles[msg.sender][i].sharedWith[j] == user) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
