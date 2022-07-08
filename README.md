# github-issue-to-hexo

GitHub Action which converts GitHub Issue to Hexo post.

## Usage

```yml
name: Issue to Hexo
on:
  issues:
    # Sufficient to trigger this workflow when an issue is unlabeled, labeled, edited, milestoned
    types: [unlabeled, labeled, edited, milestoned]

jobs:
  build:
    runs-on: ubuntu-latest
    if: ${{ github.actor == github.repository_owner }}
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js 16.x
        uses: actions/setup-node@v2
        with:
          node-version: '16'    
      - uses: zenghongtu/github-issue-to-hexo@v1.0.1
        with:
          owner: ${{ github.repository_owner }}
          repo: ${{ github.event.repository.name }}
          issue_number: ${{ github.event.issue.number }}
          token: ${{ secrets.GITHUB_TOKEN }}
          replace: true
          output: './'
      - name: Commit report
        run: |
          git config --global user.name 'GitHub Action'
          git config --global user.email 'noreply@github.com'
          git pull
          git add .
          git commit -m "update posts"
          git push
        env:
          PUSH_KEY: ${{ secrets.PUSH_KEY }}
      - name: Install Dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: './public'

concurrency: 
  group: ${{ github.workflow }}-${{ github.event.issue.number }}
  cancel-in-progress: true   

```