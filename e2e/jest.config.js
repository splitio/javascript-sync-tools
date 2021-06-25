module.exports = {
  name: 'e2e',
  displayName: 'E2E Tests',
  preset: 'ts-jest',
  // A list of paths to directories that
  // Jest should use to search for files in
  roots: [
    '<rootDir>',
  ],
  // Test files are .js and .ts files inside of __tests__ folders and with a suffix of .test or .spec
  testMatch: ['./**/?(*.)+(spec|test).[jt]s'],
  // Required when using Split dependencies via GitHub
  // `"@splitsoftware/splitio-commons": "github:splitio/javascript-commons#branch_name",`
  transform: { '../node_modules/@splitsoftware/.+\\.(j|t)s$': 'ts-jest' },
  transformIgnorePatterns: ['/node_modules/(?!@splitsoftware/.*)'],
};
