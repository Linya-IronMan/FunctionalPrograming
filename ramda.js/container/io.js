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
/** 
* string => IO
* */
const getFileContent = (p) => {
  return () => IO.of(fs.readFileSync(path.resolve(p), 'utf-8'));
}
// const getFileContent = fs.readFileSync(path.resolve('./config.json'), {encoding: "utf-8"})
const getConfig = getFileContent('./config.json');

const changeConfig = getConfig().map(R.pipe(
  parseJson,
  either(
    R.compose(trace("修改配置成功："), R.assoc('age', 111)),
    R.compose(console.error, R.concat("错误：", R.__) )
  )
))

// 在 IO 正式调用 __value 执行之前，可以尽情组装函数，形成逻辑。所有的逻辑操作，包括输入输出，对外部的影响，都可以通过 map 来进行
// 此处 __value() 的执行，只是相当于一个启动器而已。所有的逻辑都封装在 value 内部
const result = changeConfig.__value();
console.log("result", result);
