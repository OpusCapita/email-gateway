const Logger = require('@opuscapita/logger'); // Logger
const server = require('@opuscapita/web-init'); // Web server
const dbInit = require('@opuscapita/db-init'); // Database

const KafkaClient = require('@opuscapita/kafka-client');
const events = require('./events');

const isDevMode = process.env.NODE_ENV === 'development';
const logger = new Logger();

if (!isDevMode) logger.redirectConsoleOut(); // Force anyone using console.* outputs into Logger format.

// Basic database and web server initialization.
// See database : https://github.com/OpusCapita/db-init
// See web server: https://github.com/OpusCapita/web-init
// See logger: https://github.com/OpusCapita/logger
async function init(config) {
    const db = await dbInit.init(config && config.db);

    // TODO: Remove this once you have real permissions using ACL.
    if (isDevMode) {
        const retry = require('bluebird-retry'); // Only for development
        await retry(
            () =>
                db.query(
                    'REPLACE INTO Permission (authorityId, resourceGroupId) VALUES("user", "email-gateway/*")'
                ),
            { max_tries: 50 }
        ); // Add generic wildcard permissions for the service
    }
    await server.init({
        server: {
            port: process.env.port || 3054,
            enableBouncer: true,
            enableEventClient: true,
            events: {
                onStart: () => logger.info('Server ready. Allons-y!')
            }
        },
        routes: {
            dbInstance: db
        }
    });

    await events.init(db, logger);
}

(() => init().catch(console.error))();
