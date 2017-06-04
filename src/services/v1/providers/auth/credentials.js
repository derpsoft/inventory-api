import LocalStrategy from 'passport-local';

const strategy = new LocalStrategy((username, password, done) => {
  return done(null, false);
});

export default (passport) => {
  // passport.use('credentials', strategy);
};
