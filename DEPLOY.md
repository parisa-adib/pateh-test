# Deployment Guide

This document provides instructions for deploying the `pateh-test-project`.

## Prerequisites

Ensure the following are installed and configured:

1. **Node.js**: Install Node.js (version 16 or later is recommended).
2. **Package Manager**: Ensure you have `npm`, `yarn`, `pnpm` installed.

## Deployment Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/parisa-adib/pateh-test.git.git
   cd pateh-test-project
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Build the Project**

   ```bash
   npm run build
   # or
   yarn build
   ```

4. **Start the Application**
   ```bash
   npm start
   # or
   yarn start
   ```

## Troubleshooting

- Check logs for errors:
  ```bash
  npm run logs
  ```
- Verify environment variables are correctly set.

## Additional Notes

- Refer to the `README.md` for more details about the project.
