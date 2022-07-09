import * as core from '@actions/core';
import * as github from '@actions/github';
import Hexo from 'hexo';
import { resolve } from 'path';

const PAGE_SIZE = 100;

async function run() {
	try {
		const owner = core.getInput('owner', { required: true });
		const repo = core.getInput('repo', { required: true });
		const token = core.getInput('token', { required: true });

		const milestone = core.getInput('milestone', { required: false });
		const output = core.getInput('output', { required: false });

		const hexo = new Hexo(resolve(process.cwd(), output));
		await hexo.init();

		const octokit = github.getOctokit(token);

		let hasMore = true;

		while (hasMore) {
			const { data: sourceData } = await octokit.request('GET /repos/{owner}/{repo}/issues', {
				owner,
				repo,
				sort: 'created',
				state: 'open',
				creator: owner,
				per_page: PAGE_SIZE,
			});

			console.log('issues length: ', sourceData.length);

			hasMore = !(sourceData.length < PAGE_SIZE);

			const data = sourceData.filter((item) => item.milestone?.title === milestone);

			for (const item of data) {
				const { title, updated_at: updated, labels, number, body: content, created_at: date } = item;

				const tags = labels.map((label: any) => label.name);
				await hexo.post.create(
					{
						title,
						date,
						updated,
						tags,
						content,
						path: `${number}`,
					} as any,
					true
				);
			}
		}
	} catch (err: any) {
		core.setFailed(err);
	}
}

run();
