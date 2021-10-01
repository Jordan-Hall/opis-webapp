module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '9e14bd02929b150a3424a7f58202488c'),
    },
  },
});
