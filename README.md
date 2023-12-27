# Gmail Services Project

## Overview

This project demonstrates a Node.js application that interacts with the Gmail API to perform tasks such as checking for new emails, sending automated replies, and adding labels to emails.

## Getting Started

### Prerequisites

Before running the project, make sure you have the following installed:

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   git clone https://github.com/your-username/gmail-services-project.git
  

2. Navigate to the project directory:

   cd gmail-services-project

3. Install dependencies:

   npm install

### Configuration

1. Set up a project in the [Google Cloud Console](https://console.cloud.google.com/).

2. Download the `credentials.json` file and save it in the project root.

3. Create an empty `token.json` file in the project root.

### Running the Application

node src/index.js

Follow the on-screen instructions to authorize the application.

## Project Structure

- **src/index.js**: Main entry point of the application.
- **src/auth.js**: Handles OAuth2 authentication.
- **src/gmailService.js**: Interacts with the Gmail API for sending replies and adding labels.


