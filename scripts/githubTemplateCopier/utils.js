import githubRequests from './githubRequests';

import { REPO_FORKED_MESSAGE, ISSUE_SETTING_MESSAGE, ISSUES_FETCHED_MESSAGE, REPO_COPIED_MESSAGE } from './constants';
const formatTicket = (ticket) => ({
  title: ticket.title,
  body: ticket.body,
  labels: ticket.labels,
});

const postTicketToTarget = (target, issues, updateProgress) =>
  new Promise((resolve, reject) => {
    const formattedTickets = issues.map(formatTicket);
    const postTicketPromises = [];
    const postTicket = (index) => {
      return githubRequests.postIssueTicket(target, formattedTickets[index]).then((resp) => {
        updateProgress(`Issue ${index + 1} / ${formattedTickets.length} copied`, formattedTickets.length, target);
        return resp;
      });
    };

    let callCount = 0;
    postTicketPromises.push(postTicket(callCount));
    const repeater = setInterval(function () {
      callCount += 1;
      if (callCount < formattedTickets.length) {
        postTicketPromises.push(postTicket(callCount));
      } else {
        resolve(Promise.all(postTicketPromises));
        clearInterval(repeater);
      }
    }, 1000);
  });

const turnOnIssuesOnRepo = (repo) => {
  return githubRequests.updateRepo(repo, { has_issues: true });
};

const copyTemplate = (source, updateProgress) => {
  return githubRequests.forkRepo(source).then((resp) => {
    const forkedRepo = `${resp.owner.login}/${resp.name}`;
    updateProgress(REPO_FORKED_MESSAGE);
    return turnOnIssuesOnRepo(forkedRepo).then(() => {
      updateProgress(ISSUE_SETTING_MESSAGE);
      return forkedRepo;
    });
  });
};

export const init = async (source, updateProgress, updateTarget, targetRepo) => {
  let target;
  if (targetRepo) {
    target = targetRepo;
    updateProgress(REPO_FORKED_MESSAGE);
    updateProgress(ISSUE_SETTING_MESSAGE);
  } else {
    target = await copyTemplate(source, updateProgress);
  }
  updateTarget(target);
  const sourceTickets = await githubRequests.getIssueTickets(source);
  updateProgress(ISSUES_FETCHED_MESSAGE);
  postTicketToTarget(target, sourceTickets, updateProgress).then(() => {
    updateProgress(REPO_COPIED_MESSAGE);
  });
};
