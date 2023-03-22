# CodeSource

### Setup

- git clone https://github.com/VaibhaveS/CodeSource.git

- Make sure you have nodejs installed in your system.

- Register the app in github (https://github.com/settings/applications/new)

  - Application name: anything
  - Homepage URL: http://localhost:3000/
  - callback URL: http://localhost:3000/auth/github/callback

- Once, you register you will have access to CLIENT_ID and CLIENT_SECRET_KEY. update the values in `.env` file.

- Setup MongoDB (refer internet/udemy course)

- Run, by running `node app.js`

- Run, frontend by going to the `/client` directory and running `npm run start`.
