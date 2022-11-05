import {Left, Right, IO, trace, map, either} from './index.js';
import * as R from 'ramda';

import fs from "fs";
import path from "path";

const parseJson = (string) => {
  try {
    return Right.of(JSON.parse(string));
  } catch (error) {
    return Left.of("JSON 解析错误");
  }
}

// const getFileContent = fs.readFileSync(path.resolve('./config.json'), {encoding: "utf-8"})
const ioConfig= IO.of(
  fs.readFileSync(path.resolve('./config.json'), 'utf-8')
);

console.log('IOConfig', ioConfig);
const ioConfig2 = ioConfig.map(
  R.compose(
    map(R.assoc("age", 1111)),
    parseJson
  )
);
console.log(either(R.identity, R.concat("Error Warning!!: ") ,ioConfig2.__value()));





