# github-issue-to-hexo

GitHub Action which converts GitHub Issue to Hexo post.

## Example

[zenghongtu/blog](https://github.com/zenghongtu/blog)

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
      # use here
      - uses: zenghongtu/github-issue-to-hexo@v2.0.0
        with:
          owner: ${{ github.repository_owner }}
          repo: ${{ github.event.repository.name }}
          token: ${{ secrets.GITHUB_TOKEN }}
          ## optional below
          milestone: 'publish'
          output: './'
      # - name: Commit report
      #   run: |
      #     git config --global user.name 'GitHub Action'
      #     git config --global user.email 'noreply@github.com'
      #     git pull
      #     git add .
      #     git commit -m "update posts"
      #     git push
      #   env:
      #     PUSH_KEY: ${{ secrets.PUSH_KEY }}
      - name: Install Dependencies
        run: yarn install
      - name: Build
        run: yarn run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: './public'

concurrency: 
  group: ${{ github.workflow }}-${{ github.event.issue.number }}
  cancel-in-progress: true   

```