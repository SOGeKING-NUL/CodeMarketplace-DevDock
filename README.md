# OpenCode: Decentralized Code Marketplace

Welcome to **OpenCode**, a decentralized marketplace for developers to monetize their code and for users to purchase high-quality projects. OpenCode leverages blockchain technology for secure, transparent, and trustless transactions, ensuring a seamless experience for both sellers and buyers.

![image](https://github.com/user-attachments/assets/291fc531-4253-4f4f-b56a-d37bcf5e05fd)


## Features

- **Create Listings**: Developers can list their projects with details like title, description, price, GitHub repository link, and a demo URL.
- **Purchase Code**: Buyers can purchase code securely using ETH, with transactions managed by smart contracts.
- **Dashboard**:
  - Sellers can manage their listings (activate/deactivate).
  - Buyers can view and access purchased code.
- **Smart Contract**: Built on Solidity, the smart contract ensures transparency and security by handling all transactions and access permissions.
- **Wallet Integration**: MetaMask or and evm supported wallet integration for connecting wallets and executing transactions.
- **Responsive UI**: A modern, user-friendly interface built with React, Tailwind CSS, and Next.js.

## Live Demo

Test the application at: [OpenCode](https://open-code-ten.vercel.app/)

## How It Works

1. **For Sellers**:
   - Connect your wallet via MetaMask or any evm supported wallet.
   - Navigate to the "Create Listing" page and provide project details.
   - Manage your listings through the dashboard.

2. **For Buyers**:
   - Browse available listings on the marketplace.
   - Purchase code by clicking "BUY NOW" on a listing card.
   - Access purchased code through the "Purchased Code" tab in the dashboard.

3. **Smart Contract Logic**:
   - The smart contract ensures that payment is transferred to the seller only when the buyer successfully purchases a listing.
   - Buyers gain access to the GitHub repository link after completing the transaction.

## Technologies Used

#### Frontend
- **React**: For building a dynamic and responsive user interface.
- **Next.js**: For server-side rendering and routing.
- **Tailwind CSS**: For styling components with utility-first CSS classes.
- **Framer Motion**: For smooth animations and transitions.

#### Backend
- **Solidity**: Smart contract development for handling transactions and permissions on the Ethereum blockchain.

#### Blockchain
- **Ethers.js**: For interacting with the Ethereum blockchain and smart contracts.
- **Wallet**: Wallet integration for connecting users' Ethereum wallets.

## Smart Contract Overview

The `CodeMarketplace` smart contract handles all core functionalities of OpenCode:

#### Structure:
