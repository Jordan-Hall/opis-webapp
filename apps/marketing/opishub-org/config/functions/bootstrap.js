'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */
const admin = require("firebase-admin");

module.exports = () => {
  admin.initializeApp({
    credential: admin.credential.cert(strapi.config.get('firebase.serviceAccount', 'defaultValueIfUndefined')),
  });
  strapi.firebase = admin;
};
