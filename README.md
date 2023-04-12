# CPU Load Monitor


A CPU usage monitoring app built in TypeScript, React, Node.js and Express . 
The application implements a local server with a single GET endpoint where consumers can fetch data about CPU usage for each core of the system it is hosted using the OS library and store it in a Data Base.

This data is consumed by a UI based on time period provided by the user for displaying the usage in line chart for each core and the latest usage for each core as a percentage.

## TL;DR
The solution has been tested with `node.js v16.x` and `npm 7.10.0`, install dependencies with `npm`, then run `npm run build` and npm start to open a browser window pointing to [http://localhost:3000](http://localhost:3000). *Happy monitoring!*

## Setting up your environment
The minimum requirements for running this project are `node.js v16.x` and `npm 7.10.0`, or later versions.

This project leverages [Create React App](https://github.com/facebook/create-react-app) (CRA) and other custom scripts for spawning dev environments, running builds and handling code optimisations. All interaction with CRA has been abstracted in custom scripts for your convenience.

Install the MongoDB using this [https://www.mongodb.com/docs/manual/installation/](https://www.mongodb.com/docs/manual/installation/).
Then Start the MongoDB and check if you are able to connect on localhost:27017.

### Installing dependencies 
As a first step prior to spawn either a development environment or a production build, please run `npm install` in the project root folder to pull all the required vendor dependencies.

## Building the CPU Monitoring App
Once all the project dependencies have been successfully installed (see _Installing dependencies_ above) you can build and consume the project simply by running

Step 1: `npm run build`

Step 2: `npm start`

You can then check the application by pointing your browser to [http://localhost:3000](http://localhost:3000).
Backend server running on port 8080  [http://localhost:8080](http://localhost:8080).

##Below is the Screenshot of the application
![Cpu Usage Monitoring App](images/img.png)
