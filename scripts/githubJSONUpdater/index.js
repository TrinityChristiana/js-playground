// check to see if user already has a entry in the JSON
// check to see if user already has a PR
// If entry is there or they have a PR, ask the user if they want to update their information, then repopulate form with the past items, on submit, update their object with the new values they have (update PR or create a new one)

// If they already have a branch and no PR's, then delete the branch and start over

// rename the branch after their Firstname Last NAme and Github User ID

// Add loading to it

// Add error handeling (when the commit fails, when the PR fails, when the branch creation fails, with getting user information fails, getFileCOntents fails, when get repo info fails, when get branch info fails)

// Refactor this code and make it cleaner

import { ACCESS_TOKEN } from '../../hiddenKeys.js';
import {
  commitToBranch,
  createBranch,
  createPR,
  getFileContents,
  getGithubUser,
  getRepoInfo,
} from './utils/data.js';

const formHTML = `
<form id="userForm">
  <div class="mb-3">
    <label for="githubAccessToken" class="form-label">Github Access Token</label>
    <input class="form-control" id="githubAccessToken" name="githubAccessToken" required value="${ACCESS_TOKEN}"/>
  </div>
  <div class="mb-3">
    <label for="firstName" class="form-label">First Name</label>
    <input class="form-control" id="firstName" name="firstName" required value="Trinity"/>
  </div>
  <div class="mb-3">
    <label for="lastName" class="form-label">Last Name</label>
    <input class="form-control" id="lastName" name="lastName" required value="Terry"/>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
`;

const defaultHTML = `
<div>
Welcome to the site!
</div>
<div id="userFormContainer">
  ${formHTML}
</div>
<div id="prUrl">
</div>
`;

const fileToUpdate = 'scripts/githubJSONUpdater/users.json';

const renderToDOM = (id, content) => {
  const el = document.getElementById(id);
  el.innerHTML = content;
};

const showPRURL = (url) => {
  renderToDOM('userFormContainer', '');
  renderToDOM('prUrl', `<a href="${url}" target="_blank">Your PR!!!</a>`);
};
const handleFileUpdate = async (accessToken, { firstName, lastName }) => {
  const { oid, id: repoId } = await getRepoInfo(accessToken);

  const { id: fileId, text } = await getFileContents(accessToken, fileToUpdate);

  const parsedContent = JSON.parse(text);
  const branchName = `${firstName}-${lastName}-${fileId.slice(-10)}`;

  const branchLastOID = await createBranch(accessToken, repoId, branchName, oid);

  const userInfo = await getGithubUser(accessToken);

  parsedContent.push({ ...userInfo, firstName, lastName });

  if (branchLastOID) {
    await commitToBranch(
      accessToken,
      firstName,
      lastName,
      branchLastOID,
      branchName,
      fileToUpdate,
      JSON.stringify(parsedContent)
    );

    const prURL = await createPR(accessToken, repoId, branchName, { firstName, lastName });
    showPRURL(prURL);
  } else {
    console.log('Error!!!');
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  const formData = {
    firstName: e.target.elements['firstName'].value,
    lastName: e.target.elements['lastName'].value,
  };
  const accessToken = e.target.elements['githubAccessToken'].value;

  handleFileUpdate(accessToken, formData);
};

const addFormListener = () => {
  const listener = document.getElementById('userForm').addEventListener('submit', handleSubmit);
  return listener;
};

const run = () => {
  renderToDOM('app', defaultHTML);
  addFormListener();
};

export { run };
