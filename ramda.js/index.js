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


/** utils ----- end */

/** ========================================================================================================= */

/** UploadFile ----- start */ 

// inputFileElement => File[]
export const getFiles = inputFileEle => inputFileEle.files;

export const fileType = _curry(file => {
  return {
    file: new File(
      [file], file.name, {
      type: !file.type
      ? "text/tab-separated-values"
      : file.type === "application/vnd.ms-excel"
      ? "text/csv"
      : file.type,
    }) 
  };
});

/** element input[type=file] => Container.of(File)[] */
export const filesTransed = _compose(_map(fileType),trace("after getFiles: "), getFiles);

/** File => boolean */ 
export const isZip = fileType => {
  const zipFileType = ["application/zip", "application/x-zip-compressed", "application/x-gzip","application/x-tar", "application/x-7z-compressed"];
  return zipFileType.includes(fileType);
};

// input[type="file"] => boolean
export const isFileListHeadZip = _compose(isZip , _head, _map(_ => _.type), getFiles);

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


