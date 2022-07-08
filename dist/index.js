"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const hexo_1 = __importDefault(require("hexo"));
const path_1 = require("path");
const MILESTONE_PUBLISH = 'publish';
function run() {
    return __awaiter(this, void 0, void 0, function* () {
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
            const response = yield octokit.rest.issues.get({ issue_number, owner, repo });
            const hexo = new hexo_1.default((0, path_1.resolve)(process.cwd(), output));
            yield hexo.init();
            const { title, updated_at: updated, labels, milestone, body: content, created_at: date } = response.data;
            if ((milestone === null || milestone === void 0 ? void 0 : milestone.title) !== MILESTONE_PUBLISH) {
                console.log(`Issue does not have milestone(${MILESTONE_PUBLISH})`);
            }
            else {
                const tags = labels.map((label) => label.name);
                hexo.post.create({
                    title,
                    date,
                    updated,
                    tags,
                    content,
                    path: `${issue_number}`,
                }, replace);
            }
        }
        catch (err) {
            core.setFailed(err);
        }
    });
}
run();
