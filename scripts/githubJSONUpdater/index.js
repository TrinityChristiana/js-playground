// create a branch for user
// commit user information to the file information on new branch
// Create a PR with the new changes
// Get back link to the PR

import { getFileContents, getRepoInfo } from './utils/data.js';

const formHTML = `
<form id="userForm">
  <div class="mb-3">
    <label for="githubAccessToken" class="form-label">Github Access Token</label>
    <input class="form-control" id="githubAccessToken" name="githubAccessToken" required value="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"/>
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
`;

const fileToUpdate = 'scripts/githubJSONUpdater/users.json';

const handleFileUpdate = async (accessToken, formData) => {
  const { oid } = await getRepoInfo(accessToken);

  const { id, text } = await getFileContents(accessToken, fileToUpdate);
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

const renderToDOM = (id, content) => {
  const el = document.getElementById(id);
  el.innerHTML = content;
};

const run = () => {
  renderToDOM('app', defaultHTML);
  addFormListener();
};

export { run };
