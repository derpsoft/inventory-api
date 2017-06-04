import _ from 'lodash';
import {
  default as logger,
} from '../../../logger';

const available = ['test', 'recurring', 'pod'];

let args = process.argv.slice(2);
let invoke = _.intersection(args, available);

if (!invoke.length) {
  logger.error(`Missing worker name argument. Expected one of ${JSON.stringify(available.slice(1))}.`);
  process.exit(1);
}

args = args.slice(1);

const isTest = invoke[0] === 'test';
if (isTest) {
  args = args.slice(1);
  invoke = invoke.slice(1);
}

const recurring = invoke[0] === 'recurring';
if (recurring) {
  args = args.slice(1);
  invoke = invoke.slice(1);
}

const Worker = require(`./${invoke[0]}`).default;
const w = new Worker(...args);

w.recurring = recurring;

logger.info(`Running ${w.name} worker${recurring ? ' every 60s':''}...`);

if (isTest) {
  try {
    w.test();
  } catch (e) {
    logger.error(e);
  }
} else {
  w.run();
}
