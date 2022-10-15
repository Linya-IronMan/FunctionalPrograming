import * as _ from "ramda";
export const _curry = _.curry;
export const _compose = _.compose;
export const _map = _.map;
export const _head = _.head;
export const _last = _.last;
export const _uniq = _.uniq;
import  Archive from './fileAnalyze';
/** utils ----- start */




export const trace = _.curry(function(tag, x){
  console.log(tag, x);
  return x;
});

export class Container {

  constructor(x) {
    this.__value = x;
  }

  static of(x) {
    return new Container(x)
  } 

  isNothing() {
    return (this.__value === null) || (this.__value === undefined);
  }


  map(func) {
    return Container.of(func(this.__value));
  }

  /** [a1, a2, a3, ...].item(a => a +1) -> [a1+1, a2+1, a3+1, ...] */
  item(func) {
    const isArr = _.is(Array, this.__value);
    // return _.ifElse(_.is(Array), _compose(() => Container.of(this.__value.map(func), trace("before onTrue"))), Container.of(func(this.__value)))(this.__value);
    if (isArr) {
      return Container.of(this.__value.map(func));
    } else {
      return Container.of(func(this.__value));
    }
  }
}

class Maybe {
  constructor(x) {
    this.__value = x;
  }

  static of(x) {
    return new Maybe(x);
  }

  isNothing() {
    return (this.__value === null) || (this.__value === undefined);
  }

  map(func) {
    return this.isNothing() ? Maybe.of(null) : Maybe.of(func(this.__value));
  }
}

/** (ef, tf) -> m ? tf : ef */
export const maybe = _curry(function(ef, f, m) {
  return m.isNothing() ? x : f(m.__value);
})

/** utils ----- end */

/** ========================================================================================================= */

/** UploadFile ----- start */ 

// inputFileElement => File[]
export const getFiles = inputFileEle => inputFileEle.files;

export const status = _curry((status, fileModel) => {
  return Container.of({
    ...fileModel.__value,
    status: status
  });
});

export const fileType = _curry(file => {
  return Container.of({
    file: new File(
      [file], file.name, {
      type: !file.type
      ? "text/tab-separated-values"
      : file.type === "application/vnd.ms-excel"
      ? "text/csv"
      : file.type,
    }) 
  });
});

/** element input[type=file] => Container.of(File)[] */
export const filesTransed = _compose(_map(fileType),trace("after getFiles: "), getFiles);

/** File => boolean */ 
export const isFileTypeZip = fileType => {
  const zipFileType = ["application/zip", "application/x-zip-compressed", "application/x-gzip","application/x-tar", "application/x-7z-compressed"];
  return zipFileType.includes(fileType);
};

// input[type="file"] => boolean
export const isFileListHeadZip = _compose(isFileTypeZip , _head, _map(_ => _.type), getFiles);

export const tellFileNameSuffix = fileName => fileName.includes('.') ? fileName.split('.').pop() : "";

export const zipFileNameList = _curry(async (file /* File */) => {
  const archive = await Archive.open(file);
  const filesArray = await archive.getFilesArray();
  archive._worker?.terminate();
  return filesArray.map(_ => _.file.name);
});

/** File -> string[] */ 
export const fileSuffix = _curry(async (file) => {
  const fileNameList = await zipFileNameList(file);
  return _compose(_uniq, _map(tellFileNameSuffix))(fileNameList);
});

/** UploadFile ----- end */ 


