/* eslint-env node */
/** @type {import('semantic-release').GlobalConfig} */
module.exports = {
  branches: [
    'main',
    {
      name: 'canary',
      prerelease: true,
    },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md'],
        message: 'release: ${nextRelease.version} \n\n ${nextRelease.notes}',
      },
    ],
    '@semantic-release/github',
  ],
}
