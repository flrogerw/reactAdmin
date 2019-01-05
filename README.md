# Admin

## Getting Up and Running
### Prerequisites
- Node v4+

### Installation
- Clone this repo
- Run `$ npm install` to install dependencies (there will be some warnings)
- Run `$ npm start` to start the dev server and browse to `http://localhost:5000` to see the app

Note: In development, `Ctrl + H` hides the Redux DevTools and `Ctrl + W` changes its position on the screen

### Code linting
- Run `$ npm run lint` to lint the source code against Airbnb code style  

### Running Tests
- Run `$ npm test` to run the test suite once
- Run `$ npm run test:watch` to run the test suite on every file update

Some of the tests are now failing and I don't have time to fully understand the test framework. I can see that when users is being tested, cart code is also being executed.  Filtering tests in categories fail and yet I have verified the methods work fine.

## Technology
This project uses the following technologies:
- React + Redux
- Routing: react-router-redux
- Layout: Material Design
- Tooling: webpack, babel, eslint, karma, hot loading
- Testing: karma, mocha, expect, enzyme

## Deployment

#### Manual deployment

Heroku setup instructions:

 - Login / Create an account on heroku.com
 - Install the [heroku toolbelt](https://toolbelt.heroku.com/) to utilize the CLI tool

Once installed,

 - login via the terminal: $ heroku login
 - Point to the heroku remote (from within the project root directory): heroku git:remote -a <your-project-name>
 - git push heroku master

That's it! On deploy, Heroku automatically sets the NODE_ENV to 'production', and our webpack configs do the rest. A brief summary of how that works is listed in the README. If you want to trace the logic fork between development and production environments, start with the `server.js` file.

__On Windows__, it is best to run the heroku stuff in powershell or cmd.exe; there's a problem with cygwin https://github.com/heroku/cli/issues/84

If deploying to a CDN, etc. you may choose to use the `build` script to bundle the app, then serve the
contents of the `dist` directory.
