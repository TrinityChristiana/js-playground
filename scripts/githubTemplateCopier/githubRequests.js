import axios from "axios";
import { store } from "../../index";

const baseUrl = `https://api.github.com/`;

const githubBase = () =>
    axios.create({
        baseURL: baseUrl,
        headers: {
            Authorization: `token ${store.getState().userInfo.accessToken}`,
            Accept: "application/vnd.github.v3+json",
        },
    });

const getIssueTickets = (repo) => {
    return githubBase()
        .get(`repos/${repo}/issues?state=all&per_page=100`)
        .then(({ data }) =>
            data
                .filter((item) => !item.pull_request)
                .sort((a, b) => a.number - b.number)
        );
};

const forkRepo = (repo) => {
    return githubBase()
        .post(`repos/${repo}/forks`)
        .then((resp) => resp.data);
};

const updateRepo = (repo, updateObj) => {
    return githubBase()
        .patch(`repos/${repo}`, updateObj)
        .then((resp) => resp.data);
};

const postIssueTicket = (repo, issue) => {
    return githubBase()
        .post(`repos/${repo}/issues`, issue)
        .then((resp) => resp.data);
};

export default { getIssueTickets, postIssueTicket, updateRepo, forkRepo };
