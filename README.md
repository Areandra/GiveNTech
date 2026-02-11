# GiveNTech

## Project Overview
GiveNTech is a web application built using the AdonisJS framework. This application aims to provide robust features and a smooth user experience while maintaining clean code architecture and scalability.

## Environment Configuration
To set up the environment for the GiveNTech project, follow the steps below:

### Prerequisites
1. **Node.js**: Make sure Node.js is installed. You can download it from [nodejs.org](https://nodejs.org/).
2. **Redis**: Ensure you have Redis installed and running for OTP (One-Time Password) management. Refer to the [Redis installation guide](https://redis.io/download) if needed.

### Installation Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/Areandra/GiveNTech.git
   cd GiveNTech
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**
   Copy the `.env.example` file to `.env` and configure the necessary environment variables. Ensure the following configurations:
   ``` 
   # Application environment
   NODE_ENV=development
   
   # Port Configuration
   PORT=3333
   
   # Redis Configuration for OTP Management
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   REDIS_PASSWORD=null
   ```
4. **Run the application**
   ```bash
   npm run dev
   ```

## Running Tests
To run tests for the application, use the following command:
```bash
npm run test
```

## Contributing
Contributions are welcome! Please make sure to read the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to the project.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- [AdonisJS](https://adonisjs.com) - The web framework used for this application.
- [Redis](https://redis.io) - The in-memory data structure store used for OTP management.