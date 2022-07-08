import * as core from '@actions/core';
import * as github from '@actions/github';
import Hexo from 'hexo';
import { resolve } from 'path';

const MILESTONE_PUBLISH = 'publish';

async function run() {
	try {
		const owner = core.getInput('owner', { required: true });
		const repo = core.getInput('repo', { required: true });
		const issue_number = +core.getInput('issue_number', { required: true });

		if (Number.isNaN(issue_number)) {
			throw new Error('issue_number is incorrect!');
		}

		const token = core.getInput('token', { required: true });
		const replace = core.getBooleanInput('replace', { required: false });
		const output = core.getInput('output', { required: false }) || './';

		const octokit = github.getOctokit(token);
		const response = await octokit.rest.issues.get({ issue_number, owner, repo });

		const hexo = new Hexo(resolve(process.cwd(), output));
		await hexo.init();
		const { title, updated_at: updated, labels, milestone, body: content, created_at: date } = response.data;

		if (milestone?.title !== MILESTONE_PUBLISH) {
			console.log(`Issue does not have milestone(${MILESTONE_PUBLISH})`);
		} else {
			const tags = labels.map((label: any) => label.name);
			hexo.post.create(
				{
					title,
					date,
					updated,
					tags,
					content,
					path: `${issue_number}`,
				} as any,
				replace
			);
		}
	} catch (err: any) {
		core.setFailed(err);
	}
}

run();
