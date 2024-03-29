# opuscapita-service-template
This repository provides a general service template for creating custom services based on the Andariel platform. It supplies most of the required file system structure and libraries for building and testing newly created services and is equipped with all basic components to build a RESTful and database oriented service. It provides configurations to build a docker environment to run the code, UIs and tests.

To customize this template to create your own service, just follow the instructions in this document.
Have fun!

#### Index
- [opuscapita-service-template](#opuscapita-service-template)
      - [Index](#index)
    - [Get it!](#get-it)
      - [Replace placeholders](#replace-placeholders)
      - [Manual replacement](#manual-replacement)
    - [Start scripts](#start-scripts)
    - [Docker](#docker)
    - [Adding to GitHub](#adding-to-github)
    - [Build server (CircleCI)](#build-server-circleci)
        - [GitHub](#github)
        - [NPM](#npm)
    - [Andariel architecture](#andariel-architecture)
    - [Introduction to code](#introduction-to-code)
      - [Andariel libraries](#andariel-libraries)
      - [Consul server](#consul-server)
    - [Service structure](#service-structure)
        - [config directory](#config-directory)
        - [local directory](#local-directory)
        - [src directory](#src-directory)
        - [test directory](#test-directory)
    - [How to create migrations](#how-to-create-migrations)
        - [Files](#files)
    - [How to create models](#how-to-create-models)
    - [How to create routes](#how-to-create-routes)
    - [How to do logging](#how-to-do-logging)
    - [How to write tests](#how-to-write-tests)
    - [How to create documentation](#how-to-create-documentation)
      - [Preparing documentation](#preparing-documentation)
      - [Service API documentation](#service-api-documentation)
      - [Domain documentation](#domain-documentation)
      - [Code API documentation](#code-api-documentation)
      - [README](#readme)
    - [How to get consul configs](#how-to-get-consul-configs)
    - [How to do inter-service calls](#how-to-do-inter-service-calls)
      - [Calling services without user authentication](#calling-services-without-user-authentication)
      - [Calling services with service authentication](#calling-services-with-service-authentication)
      - [Calling services with user authentication](#calling-services-with-user-authentication)

---

### Get it!

Clone the repository:

```
git clone https://github.com/OpusCapita/service-template.git
- or -
git clone git@github.com:OpusCapita/service-template.git
```

First rename the cloned directory **service-template** to the name of your new service and cd into it.
Now remove the whole **.git** directory and run

```
git init
```

#### Replace placeholders

Now you can either run the **setup-template.sh** bash script which will replace all placeholders with the values you are asked for by the script or you can edit all files manually.

#### Manual replacement

Open the **package.json** file in your editor and change the following properties to your own values:

- name
- description
- author
- repository
- bugs
- homepage

Open the following files and replace all placeholders in double curly braces (e.g. {{maintainer}}) with your values:

- Dockerfile
- docker-compose.yml
- docker-compose.override.yml
- docker-compose.ci.yml
- src/server/index.js
- local/index.js
- .env

---

### Start scripts

There are several different start scripts ready to be used to run your service. The following are the most important/exceptional:

- npm run **dev**
  > Starts the service using nodemon watching src/server for changes.
- npm run **dev:production**
  > Starts the service with all required dev configs but with less overhead.
- npm run **local**
  > Starts the service with a local React development UI using nodemon watching src/server for changes.
- npm run **perf**
  > Starts the service with code performance recording.
- npm run **test-raw**
  > Runs tests exactly like npm run test but outputs directly to the console not to a file.

---

### Docker

You can now build your service image the first time. You can either build it through a **docker build** command or through a **docker-compose build** command from within the service's directory:

```
docker build -t opuscapita/{{your-service-name}}:dev -f Dockerfile .
```

```
docker-compose build
```

If everything worked to your satisfaction, execute the following command to run your new service. Please have a look at the [Start scripts](#start-scripts) section to find a script that suits you best.

```
docker-compose run --service-ports main npm run local
```
or
```
docker-compose up
```

> Sometimes the initial start of the service does not succeed because of timeouts happening when creating and starting containers at the same time on slow machines. If your service did not start press Ctrl+C and run the docker command again.

 > In order to pass additional environment variables (e.g. secrets that must not be saved in the code) change your docker-compose.yml to pass these variables to docker and run your docker commpand by adding them to the **.env file** or by prepending the variables to you command like **MY_VAR=myValue docker-compose up**. You can pass multiple environment variables.

> For a list of all used ports, please have a look the [service port list](https://github.com/OpusCapita/bnp/wiki/portList).

Now remember the port you put into the .env file, go to your web browser an open "http://localhost:{{port}}/". If everything worked, the browser should show either a plain text "Hello world!" or a user interface.

---

### Adding to GitHub

If all the above test commands succeeded, go to [GitHub](https://github.com) and create a new repository for your service. Now add all your files and push them to GitHub.

```
git add .
git commit -m "Initial commit."
git remote add origin https://github.com/OpusCapita/{{your-service-name}}
git push -u origin develop
```

After that, you can configure the build server for automated building and testing. To do so please visit [CircleCi](https://circleci.com/add-projects/gh/OpusCapita), find your service there and hit the "Set Up Project" button.

---

### Build server (CircleCI)

The Andariel build process called Duriel requires some basic variable setup inside the build server. These variables shoud be copied from existing repositories in order to keep a uniform environment.

> Please contact the Andariel team to get the environment variables and SSH keys copied to your setup.

To configure a project to be built automatically on [CircleCI](https://circleci.com) after pushing it to GitHub, please follow these steps:

- Login to CircleCI using your web browser.
- Go to https://circleci.com/add-projects/gh/OpusCapita.
- Find your repository.
- Click "Set Up Project" on the right
- Configure Environment variables and SSH keys. Please reach out to the Andariel team to get the right values copied there.

Now your service gets built automatically every time you push your repository to GitHub.

##### GitHub

If you are using documentation generation like it is intended by this service-template, you will have to add a private SSH key to CircleCI in order to push to GitHub. How documenting works is described in the [How to create documentation](#how-to-create-documentation) section.

> If you do not already own a GitHub SSH key or you do not want to use yours, just create new key to be used by CircleCI:
> * [Generating a new SSH key](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)
> * [Adding a new SSH key to your GitHub account](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/)

If you have a public-private key pair available, go to the settings section of your build project at CircleCI and find the **SSH Permissions** tab on the left. On the right click **Add SSH key**. Add you private key there and provide *github.com* as hostname.

Now pushing to GitHub should work as expected.

##### NPM

If your project consists of a module which should be published to NPM, go to your **circleci.yml** file and uncomment all sections prefixed with **NPM_**. Additionally you will have to add the following environment variables to CircleCI:

- NPM_USER
- NPM_PASS
- NPM_EMAIL

> Please contact the Andariel team to get these variables copied to you setup if you do not publish modules under your own name.

---

### Andariel architecture

The technical foundation of the Business Network Portal is the [Andariel](https://github.com/OpusCapita/andariel) platform. For further information, please visit the following links:

* [Architecture](https://github.com/OpusCapita/bnp/wiki/Architecture)
* [Authentication Flow](https://github.com/OpusCapita/bnp/wiki/Authentication-Flow)
* [Build Process](https://github.com/OpusCapita/bnp/wiki/Build-Process)
* [Service port list](https://github.com/OpusCapita/bnp/wiki/portList)

---

### Introduction to code

This service template provides general structures and modules that should be used as provided to maintain a system environment, where all services follow the same conventions. Shard modules like [config](https://github.com/OpusCapita/config), [web-init](https://github.com/OpusCapita/web-init) and [db-init](https://github.com/OpusCapita/db-init) are meant to setup and maintain all services in a much easier way.

The web server module will allow you to easily publish a service API in a RESTful manner.

The database module allows abstracted access to an underlying database. Additionally, this module provides automated data migration, test data population and database model registration. The required database configuration is automatically fetched using Consul.

In addition, this template module is already prepared for documenting the JavaScript API of a service. The documentation process is tailored to fit into the GitHub wiki of a service's repository. For more information take a look at [How to create documentation](#how-to-create-documentation).

#### Andariel libraries

There are several libraries that are made to be more or less exclusively used for Andariel projects.

- [db-init](https://github.com/OpusCapita/db-init) - Database initialization, connection and migration
- [web-init](https://github.com/OpusCapita/web-init) - Web server and request environment augmenter
- [config](https://github.com/OpusCapita/config) - Service registry and configuration value accessor
- [cache](https://github.com/OpusCapita/cache) - Plug-in based caching interface
- [kafka-client](https://github.com/OpusCapita/kafka-client) - Kafka message client
- [event-client](https://github.com/OpusCapita/event-client) - RabbitMQ message client
- [redis-client](https://github.com/OpusCapita/redis-client) - Redis storage and pub/sub access
- [bouncer](https://github.com/OpusCapita/bouncer) - Security library also coming with web-init
- [useridentity-middleware](https://github.com/OpusCapita/useridentity-middleware) - Session decryption middleware coming with web-init

#### Consul server
This service template will set up the following consul keys for you using an NPM script.

* **{{your-service-name}}/db-init/database**
* **{{your-service-name}}/db-init/user**
* **{{your-service-name}}/db-init/password**
* **{{your-service-name}}/db-init/populate-test-data**

The endpoint **mysql** will be automatically available due to the composition of the **docker-compose.yml** file.

---

### Service structure
The most important structural file system elements are:

- [config](#config-directory)
- [local](#local-directory)
- [rest-doc](#service-api-documentation)
- [src](#src-directory)
    - [client](#src-directory)
    - [server](#src-directory)
        - [api](#src-directory)
        - [db](#src-directory)
            - [migrations](#src-directory)
            - [models](#src-directory)
        - [routes](#src-directory)
- [test](#test-directory)
    - [client](#test-directory)
    - [server](#test-directory)

There are additional files for docker, npm and node to quickly get a runnable service environment.

##### config directory
All required configuration data should go here. At this time, there is no further structure inside that directory. It is up to the developer do decide, where and how to put server, client and/or service configuration data there.

##### local directory
The local directory contains a setup to launch a local development UI that provides all components of a full single-page application (SPA). As the Andariel system requires a basic, contectual environment, running Andariel based UI components need such a setup even for testing. The local directory is only used if the service was started using `npm run local`.

##### src directory
The src directory will contain all the source code required to run the service. It contains two subdirectories for **client** code and for **server** code. The inner structure of the **client** directory is currently not specified.

The **server** directory contains two subfolders for database related code (**db**) and REST **routes** related code. For further information see [How to create routes](#how-to-create-migrations).

The **api** directory is meant to be a proposal. In most cases it can be benificial to create a separate API or business layer between the actual REST interface and the backend system e.g. a database. Those business or management layer files should go here.

The **db** directory contains two subfolders for data migration (**migrations**) and database **models**. The contents of this subdirectories has to follow different rules which will be explained later in this document. See [How to create migrations](#how-to-create-migrations) and [How to create models](#how-to-create-models) for further information.

##### test directory
The test directory should contain all unit tests for **client** and **server** code. For further information see [How to write tests](#how-to-write-tests)

---

### How to create migrations
In this service template, database migration is split in two different kinds of actions. The first one deals with structural and existing data migration, the other one deals with populating test data for development and test purposes.

Migrations have to follow some rules in order to get executed.

All migration files have to be located at **./src/server/db/migrations**. The files in this directory are executed in ascending alphanumeric and alphabetical order. This means, that every new migration needs to take place after all earlier migrations by naming it with a higher number in front or the next letter from the alphabet. Files that have already been processed successfully in the past will be noticed but not executed again.

##### Files
Structure/data migrations and test data files are split in order to decide whenever to automatically populate test data e.g. into a development system and when not.

All Structure and data migration files have to be suffixed with **.main.js** while test data files have to be suffixed with **.test.js**. The basic inner structure of both file types looks like this:

```JS
// Executed when a migration should be applied.
module.exports.up = async function(db, config)
{
    // Code goes here.
    // Always return a promise.
}

// Executed if an applied migration should get reverted.
module.exports.down = async function(db, config)
{
    // Code goes here.
    // Always return a promise.
}
```

> Please note, that all existing migrations should always be left at their release state. Therefor do not change older migration or test data files to fit newer structures. In addition, please mind that defined sequelize JavaScript models do not get versioned like migrations do. These models always represent the latest state of your code. As a result, older migrations might not work anymore if these migrations are using JavaScript model objects to insert data because the models might have changed over time. In order to insert data, please consider using the *queryInterface* of sequelize.

For more details take a look at the example files inside the **./src/server/db/migrations** directory of this service template.

---

### How to create models
Database models are located inside the **./src/server/db/models** directory. The database component [@opuscapita/db-init](https://github.com/OpusCapita/db-init) will treat the whole **models** directory as a single module. It is up to the developer of a service to structure the rest of this directory. In order to get executed, the module has to provide an **index.js** file defining the following structure:

```JS
module.exports.init = async function(db, config)
{
    // Code goes here.
    // Always return a promise.
}
```

For more details take a look at the example file inside the **./src/server/db/models** directory of this service template.

---

### How to create routes
The REST route configuration is located inside the **./src/server/routes** directory. The web server component [web-init](https://github.com/OpusCapita/web-init) will treat the whole directory as a single module. It is up to the developer of a service to structure the rest of this directory. In order to get executed, the module has to provide an **index.js** file defining the following structure:

```JS
module.exports.init = async function(app, db, config)
{
    // Code goes here.
    // Always return a promise.
}
```
For more details take a look at the example file inside the **./src/server/routes** directory of this service template.

---

### How to do logging

Logging in services should be done using the [logger](https://github.com/OpusCapita/logger) module. It provides context extended logging in a common way which is flexible and consistent at the same time. For further information about the API of this module visit it's [wiki](https://github.com/OpusCapita/logger).

```JS
const Logger = require('@opuscapita/logger');

var logger = new Logger({});
logger.info('Hello, %s', 'world!');
```

---

### How to write tests
Tests are actually executed using nyc and mocha so files inside the **test** directory have to follow the rules of mocha testing. All files have to be suffixed with **.spec.js** in order to get executed.

Just run
```
docker-compose run main npm run test
```
to execute all tests inside the **client** and **server** subdirectories. Take a look at the **scripts** section inside the main **package.json** to see how the testing is configured.

---

### How to create documentation
Depending on the purpose of your module, there are four different kinds of documentation types available:

* Service API documentation (endpoints)
* Domain documentation (database models)
* Code API documentation
* README documentation

All documentation processes provided with this service template are tailored to meet the requirements of GitHub.

#### Preparing documentation

Before you can create actual output, please follow this instructions:

- Go to your service repository page on GitHub and create the first wiki page.

- Go to the service code on your local host and clone https://github.com/OpusCapita/{{your-service-name}}.wiki.git or git@github.com:OpusCapita/{{your-service-name}}.wiki.git into the directory.

- Rename the directory from {{your-service-name}}.wiki to wiki.

All the scripts already provided by this template should now be able to write their output to the wiki directory. To send all contents to GitHub, just commit and push the wiki directory.

#### Service API documentation
The purpose of the service API documentation is helping others on how to communicate with your service. It has to provide all public endpoints and the data structures used for in- and output including HTTP headers, URL- and query parameters.

The service API documentation is to be written using the [RAML modeling language](http://raml.org). The finished RAML definition will then get transformed into a Markdown documentation using the [raml-to-markdown](http://npmjs.com/package/raml-to-markdown) tool. If you are using Atom as your editor, you should have a closer look at the [API Workbench](http://apiworkbench.com) extension.

This service template already contains an example RAML project structure inside the **rest-doc** directory.

To finally generate the documentation run:

```
docker-compose run main npm run rest-doc
```

> Search for output inside the **wiki/rest-doc** directory.


#### Domain documentation
The domain documentation is used to document the database entities used by a service. By using the [sequelize-to-markdown](https://www.npmjs.com/package/sequelize-to-markdown) tool, you can easily generate a Markdown documentation out of your sequelize models.

Before starting to document your code, please read the [Requirements](https://www.npmjs.com/package/sequelize-to-markdown#requirements) section of sequelize-to-markdown carefully.

If your code is finally ready for Markdown rendering, run the following command:

```
docker-compose run main npm run domain-doc
```

> Search for output inside the **wiki/domain-doc** directory.

#### Code API documentation
As it is always a good idea to document your source code in a lightweight way, creating a parsed documentation output is only needed if you use this service template for creating shared modules that provide public APIs for others.

To document your JavaScript API please follow the rules of [JSDoc](http://usejsdoc.org).

If your code is finally ready for Markdown rendering, run the following command:

```
docker-compose run main npm run api-doc
```

> Search for output inside the **wiki/api-doc** directory.

#### README
The README.md file in the main directory of your service should always contain a hand written Markdown documentation with facts important for users of your service.

If you are using this service template for creating shared modules, it is always a good idea to place a simple tutorial inside the README file as this is the first page on GitHub and npmjs.

---

### How to get consul configs

In order do use consul in a common, unified way across all services, every service should use the [@opuscapita/config](https://github.com/OpusCapita/config) in order to easily get configuration and endpoint data from the central service registry.

```JS
const config = require('@opuscapita/config');

// You might want to pass a configuration object to the init method. A list of parameters and their default values
// can be found at the .DefaultConfig module property.
config.init({}).then(console.log).catch(console.log);
```

For further information on how to use the API of this module please visit its [wiki](https://github.com/OpusCapita/config/wiki) page.

---

### How to do inter-service calls

Inter-service requests should be done using the [service-client](https://github.com/OpusCapita/service-client) module. It integrates well into the OpusCapita Business Network eco system and is designed to use consul in order to dynamically get endpoint configurations to access the target service requested. With this module a developer does not have to know hostname/IP and port of the target service. It's name inside the consul service registry and the requested URI would be enough.

Calls to another service using ServiceClient can be done either **without authentication**, **with service authentication** or with **user authentication**.

#### Calling services without user authentication

```JS
const ServiceClient = require('@opuscapita/service-client');

var client = new ServiceClient();

// main => Name of service endpoint in Consul.
// / => Path to access on the web server.
client.get('main', '/').spread(console.log);
```

#### Calling services with service authentication
Calling a service can also be done using pre-configured service credentials stored in consul. The service name gets determined automatically. For more information please have a look at the [ServiceClient](https://github.com/OpusCapita/service-client#origin-service-based-authentication) documentation.

```JS
const ServiceClient = require('@opuscapita/service-client');

var client = new ServiceClient();

// main => Name of service endpoint in Consul.
// / => Path to access on the web server.
// true => ServiceClient will try to log-in using pre-configured service credentials from consul.
client.get('main', '/', true).spread(console.log);
```

#### Calling services with user authentication
Calling a service can also be done using a user's authorization so calls are done with ones permissions. This requires making service to service requests from inside an [@opuscapita/web-init](https://github.com/OpusCapita/web-init) request context. It could be done e.g. inside a middleware or an endpoint.

```JS
module.exports.init = async function (app, db, config)
{
    app.get('/', (req, res) =>
    {
        req.opuscapita.serviceClient.get('main', '/').spread(console.log);
    });
}
```

For further information on how to use the API of this module please visit its [wiki](https://github.com/OpusCapita/service-client/wiki) page.
