

const init = () => {
  console.log("running Repo Copier");
  document.querySelector("#app").innerHTML = `
    <input id="template-repo" placeHolder="Add template route here"/>
    <br/>
    <button id="submit-template">Copy Repo</button>
  `
}

export default init;
