/** @type {import('semantic-release').GlobalConfig} */
module.exports = {
  branches: [
    'main', // stable releases

    // Pre-releases from any feature branch (e.g., 1.2.0-feature-login.1)
    { name: 'feature/*', prerelease: true },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    ['@semantic-release/github'],
  ],
}
