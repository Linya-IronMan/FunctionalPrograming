import {IO, trace} from './index.js';
import * as R from 'ramda';

import fs from "fs";
import path from "path";

// const getFileContent = fs.readFileSync(path.resolve('./config.json'), {encoding: "utf-8"})
const ioConfig= IO.of(
  fs.readFileSync(path.resolve('./config.json'), 'utf-8')
);

console.log('IOConfig', ioConfig);
const ioConfig2 = ioConfig.map(R.compose(
  trace("after set age"), 
  R.assoc("age", 1111), 
  trace("after json parse"), 
  JSON.parse));
console.log('ioConfig2', ioConfig2.__value());





