const url = 'https://api.github.com/graphql';
const repoName = "js-playground";
const repoOwner = "TrinityChristiana";

export const getGithubUser = (token) => {
  return fetch(`${url}`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({
      query: `query { viewer { login }}`,
    }),
  })
  .then(resp => resp.json())
};

export const getRepoInfo = (token) => {
  return fetch(`${url}`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
    method: "POST",
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
          }
        }
      `,
    }),
  })
  .then(resp => resp.json())
  .then(resp => ({
    oid: resp.data.repository.defaultBranchRef.target.history.nodes[0].oid
  }))
}

export const getFileContents = (token, filePath) => {
  return fetch(`${url}`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({
      query: `
        {
          repository(name: "${repoName}", owner: "${repoOwner}") {
            object(expression: "master:${filePath}") {
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
  .then(resp => resp.json())
  .then(resp => resp.data.repository?.object);
};
