import { postTicketToTarget } from '../helpers/githubHelper.js';
// import { default as issues } from './db/issues.json';

const onUpdate = (str) => {
  console.warn(str);
};

const init = () => {
  console.log('Issues App Running');
};

export default init;
