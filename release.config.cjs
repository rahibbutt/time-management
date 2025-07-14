/** @type {import('semantic-release').GlobalConfig} */
module.exports = {
  branches: [
    'main', // for stable releases
    { name: 'feature/*', prerelease: true }, // auto-uses the branch name
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
