import * as _ from 'ramda';
export const _curry = _.curry;
export const _compose = _.compose;
export const _map = _.map;
export const _head = _.head;
export const _last = _.last;
export const _uniq = _.uniq;
import * as R from 'ramda';
import Archive from './fileAnalyze';
/** utils ----- start */

export const trace = _.curry(function (tag, x) {
    console.log(tag, x);
    return x;
});

export const getFiles = inputFileEle => inputFileEle.files;

export const fileInit = file => {
    return {
        file: new File([file], file.name, {
            type: !file.type
                ? 'text/tab-separated-values'
                : file.type === 'application/vnd.ms-excel'
                ? 'text/csv'
                : file.type,
        }),
        status: 0,
        modalMatched: [],
    };
};

export const filesTransed = _compose(
    _map(fileInit),
    trace('after getFiles: '),
    getFiles
);

/** File => boolean */
export const isZip = fileInit => {
    const zipFileType = [
        'application/zip',
        'application/x-zip-compressed',
        'application/x-gzip',
        'application/x-tar',
        'application/x-7z-compressed',
    ];
    return zipFileType.includes(fileInit.file.type);
};

// input[type="file"] => boolean
export const isFileListHeadZip = _compose(
    isZip,
    _head,
    _map(_ => _.type),
    getFiles
);

export const tellFileNameSuffix = fileName =>
    fileName.includes('.') ? fileName.split('.').pop() : '';

export const zipFileNameList = async (file /* File */) => {
    const archive = await Archive.open(file);
    const filesArray = await archive.getFilesArray();
    archive._worker?.terminate();
    return filesArray.map(_ => _.file.name);
};

/** File -> string[] */
export const fileSuffix = async file => {
    const fileNameList = await zipFileNameList(file);
    return _compose(_uniq, _map(tellFileNameSuffix))(fileNameList);
};

const modalCheckRules = {
    modalFileTypesSimpleFiles: {
        0: ['csv'],
        4: ['csv', 'tsv', 'json'],
    },
    modalFileTypes: {
        0: ['csv'],
        1: ['avi', 'mp4', 'csv', 'jpg', 'jpeg', 'png', 'bmp', 'json', 'wav'],
        2: ['csv', 'jpeg', 'jpg', 'png', 'bmp', 'json', 'npy', 'txt', 'xml'],
        3: ['csv', 'wav', 'mp3'],
        4: ['csv', 'data', 'json', 'tsv', 'txt'],
        5: ['csv', 'jpg', 'json', 'png'],
    },
    labelFileTypes: {
        1: ['csv'],
        2: ['csv', 'json', 'txt', 'xml'],
        3: ['csv'],
        4: ['csv', 'txt'],
    },
};

/** UploadFile ----- end */
const ModalType = {
    Table: '0',
    Video: '1',
    Image: '2',
    Audio: '3',
    Txt: '4',
    Multi: '5',
    Unkonw: '6',
};

// 规则-类型 映射组
const modalFeatureFileMap = {
    [ModalType.Table]: ['csv'],
    [ModalType.Video]: ['avi', 'mp4'],
    [ModalType.Image]: ['jpeg', 'jpg', 'png', 'bmp', 'npy'],
    [ModalType.Audio]: ['wav', 'mp3'],
    [ModalType.Txt]: ['json', 'txt'],
};

const label = {
    0: '表格模态',
    1: '视频模态',
    2: '图像模态',
    3: '⾳频模态',
    4: '⽂本模态',
    5: '多模态',
    6: '⽆法识别',
};

export const belongTo = R.flip(R.includes);
// export const belongTo = R.curry((arr, target) => R.includes(R.__, arr)(target))

console.log('belongTO test', belongTo([1, 2, 3], 1));

/**
 * 检测文件清单是否全属于指定模态支持的文件列表
 * @param：rules [csv, json, txt]
 * @param: suffixs: [csv]
 * return：boolean
 */
export const isAllBelongTo = R.curry((rules, suffixList) =>
    R.all(belongTo(rules), suffixList)
);
// const isAllBelongToSimpleTable = isAllBelongTo(modalCheckRules.modalFileTypesSimpleFiles[ModalType.Table])
// console.log("isAllBelongToSimpleTable", isAllBelongToSimpleTable(['csv']));

/**
 * 根据不同的规则识别当前文件应该属于什么模态类型
 * @param  modalRule { 0: [csv, json], 1: [...], 2: ... }
 * @param  suffixList [csv, json]
 *@return [0, 1, 2]
 */
const getMatchedModalBy = R.curry((modalRule, suffixs) =>
    R.filter(
        modal => isAllBelongTo(modalRule[modal], suffixs),
        R.keys(modalRule)
    )
);

const getMatchedModalBySimpleRules = getMatchedModalBy(
    modalCheckRules.modalFileTypesSimpleFiles
);
// console.log(
//     getMatchedModalBySimpleRules(['csv']),
//     'getMatchedModalBySimpleRules'
// );

const getMatchedModalByZipRules = getMatchedModalBy(
    modalCheckRules.modalFileTypes
);

/** 从文件名中提取出文件后缀 */
const parseFileName = fileName => fileName.split('.').pop() || '';

export const modalCheckForSimpleFile = target => {
    const { file } = target;
    target.suffixList = [parseFileName(file.name)];
    target.modalMatched = getMatchedModalBySimpleRules(target.suffixList);
    target.modalMatchedLabel = R.map(R.prop(R.__, label), target.modalMatched);
    return target;
};

export const modalCheckForZipFile = async target => {
    const { file } = target;
    target.suffixList = await fileSuffix(file);
    target.modalMatched = getMatchedModalByZipRules(target.suffixList);
    target.modalMatchedLabel = R.map(R.prop(R.__, label), target.modalMatched);
    return target;
};
