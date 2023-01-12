// Get user to login

// Show a form
// get info from form
// get contents of file you want to update
// create a branch for user
// commit user information to the file information on new branch
// Create a PR with the new changes
// Get back link to the PR

const renderToDOM = (id, content) => {
  const el = document.getElementById(id);
  el.innerHTML = content;
};

const run = () => {
  renderToDOM("app", "Welcome to Github")
};

export { run };
