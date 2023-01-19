const url = 'https://api.github.com/graphql';
const repoName = 'js-playground';
const repoOwner = 'TrinityChristiana';
const defaultBranch = 'master';

export const getGithubUser = (token) => {
  return fetch(`${url}`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
    method: 'POST',
    body: JSON.stringify({
      query: `
      query MyQuery {
        viewer {
          url
          avatarUrl
          id
        }
      }
      `,
    }),
  })
    .then((resp) => resp.json())
    .then(({ data }) => ({
      githubUrl: data.viewer.url,
      githubImage: data.viewer.avatarUrl,
      id: data.viewer.id,
    }));
};

export const getRepoInfo = (token) => {
  return fetch(`${url}`, {
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      query: `
        {
          repository(name: "${repoName}", owner: "${repoOwner}") {
            defaultBranchRef {
              target {
                ... on Commit {
                  history(first: 1) {
                    nodes {
                      oid
                    }
                  }
                }
              }
            }
            id
          }
        }
      `,
    }),
  })
    .then((resp) => resp.json())
    .then((resp) => ({
      oid: resp.data.repository.defaultBranchRef.target.history.nodes[0].oid,
      id: resp.data.repository.id,
    }));
};

export const getFileContents = (token, filePath) => {
  return fetch(`${url}`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
    method: 'POST',
    body: JSON.stringify({
      query: `
        {
          repository(name: "${repoName}", owner: "${repoOwner}") {
            object(expression: "${defaultBranch}:${filePath}") {
              id
              ... on Blob {
                id
                text
                byteSize
              }
            }
          }
        }
      `,
    }),
  })
    .then((resp) => resp.json())
    .then((resp) => resp.data.repository?.object);
};

export const getBranchInfo = (token, branchName) => {
  return fetch(`${url}`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
    method: 'POST',

    body: JSON.stringify({
      query: `
      query MyQuery {
        repository(name: "${repoName}", owner: "${repoOwner}") {
          ref(qualifiedName: "refs/heads/${branchName}") {
            target {
              ... on Commit {
                id
                history(first: 1) {
                  nodes {
                    oid
                    authoredDate
                  }
                }
              }
            }
          }
        }
      }
      `,
    }),
  })
    .then((resp) => resp.json())
    .then((resp) => resp.data.repository.ref.target.history.nodes[0].oid);
};

export const createBranch = (token, repoId, branchName, oid) => {
  return fetch(`${url}`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
    method: 'POST',

    body: JSON.stringify({
      query: `
      mutation MyMutation {
        createRef(
          input: {repositoryId: "${repoId}", name: "refs/heads/${branchName}", oid: "${oid}"}
        ) {
          ref {
            target {
              ... on Commit {
                id
                history(first: 1) {
                  nodes {
                    oid
                    authoredDate
                  }
                }
              }
            }
          }
        }
      }
      `,
    }),
  })
    .then((resp) => resp.json())
    .then((resp) => {
      if ('errors' in resp) {
        if (resp.errors[0].type === 'UNPROCESSABLE') {
          return getBranchInfo(token, branchName);
        }
        return false;
      }
      return resp.data.createRef.ref.target.history.nodes[0];
    });
};

export const commitToBranch = (token, firstName, lastName, oid, branchName, filePath, contents) => {
  return fetch(`${url}`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
    method: 'POST',
    body: JSON.stringify({
      query: `
      mutation MyMutation {
        createCommitOnBranch(
          input: {message: {headline: "${firstName} ${lastName}'s Commit to Pipeline"}, expectedHeadOid: "${oid}", branch: {branchName: "${branchName}", repositoryNameWithOwner: "${repoOwner}/${repoName}"}, fileChanges: {additions: {path: "${filePath}", contents: "${btoa(
        contents
      )}"}}}
        ) {
          commit {
            commitUrl
          }
          clientMutationId
        }
      }
      `,
    }),
  })
    .then((resp) => resp.json())
    .then((resp) => console.log(resp.data));
};

export const createPR = (token, repoId, newBranchName, { firstName, lastName }) => {
  return fetch(`${url}`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
    method: 'POST',
    body: JSON.stringify({
      query: `
      mutation MyMutation2 {
        createPullRequest(
          input: {repositoryId: "${repoId}", baseRefName: "refs/heads/${defaultBranch}", headRefName: "refs/heads/${newBranchName}", title: "${firstName} ${lastName}'s Addition to Pipeline"}
        ){
          pullRequest {
            url
          }
        }
      }
      `,
    }),
  })
    .then((resp) => resp.json())
    .then((resp) => resp.data.createPullRequest.pullRequest.url);
};
