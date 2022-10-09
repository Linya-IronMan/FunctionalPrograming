import * as _ from "ramda";
export const _curry = _.curry;
export const _compose = _.compose;
export const _map = _.map;
export const _head = _.head;
export const _last = _.last;
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

  map(func) {
    return Container.of(func(this.__value))
  }
}

/** utils ----- end */

/** ========================================================================================================= */

/** UploadFile ----- start */ 

// inputFileElement => File[]
export const getFiles = inputFileEle => inputFileEle.files;

export const fileType = _curry(file => {
  return Container.of(new File([file], file.name, {
    type: !file.type
      ? "text/tab-separated-values"
      : file.type === "application/vnd.ms-excel"
      ? "text/csv"
      : file.type,
  }));
})
/** element input[type=file] => Container.of(File)[] */
export const filesTransed = _compose(_map(fileType),trace("after getFiles: "), getFiles);
// File => boolean
export const isFileTypeZip = fileType => {
  const zipFileType = ["application/zip", "application/x-zip-compressed", "application/x-gzip","application/x-tar", "application/x-7z-compressed"];
  return zipFileType.includes(fileType);
};

// export const 

// input[type="file"] => boolean
export const isFileListHeadZip = _compose(isFileTypeZip , _head, _map(_ => _.type), getFiles);

/** UploadFile ----- end */ 


