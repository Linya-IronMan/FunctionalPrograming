import * as R from 'ramda'
let suffixList = ['csv', 'json', 'txt']
// suffixList = ['java']
// suffixList = []
const modalTypeSuffixMap = {
  "0": ["csv"],
  "1": ["avi", "mp4", "csv", "jpg", "jpeg", "png", "bmp","json","wav"],
  "2": ["csv","jpeg","jpg","png","bmp","json","npy","txt","xml"],
  "3": ["csv","wav","mp3"],
  "4": ["csv","data","json","tsv","txt"],
}
const ModalType = {
  Table: 'Table',
  Video: 'Video',
  Image: 'Image',
  Audio: 'Audio',
  Txt: 'Txt',
}
const modalFeatureFileMap = {
  [ModalType.Table]: ["csv"],
  [ModalType.Video]: ["avi", "mp4"],
  [ModalType.Image]: ["jpeg", "jpg", "png", "bmp", "npy"],
  [ModalType.Audio]: ["wav", "mp3"],
  [ModalType.Txt]: ["json", "txt"],
};
const modalOrder = ['Video', 'Audio', 'Image', 'Table', 'Txt']
const modalMap = [
  modalOrder,
  modalFeatureFileMap
]
const label = {
  0: '表格模态',
  1: '视频模态',
  2: '图像模态',
  3: '⾳频模态',
  4: '⽂本模态',
  5: '多模态',
  6: '⽆法识别',
}
const compareAryCurried = R.curry((ary, v) => {
  const intersection = R.intersection(ary, v)
  return R.on(R.equals, R.length)(ary, intersection)
})

const atWith = R.curry((compareAryCurried, map, ary) => R.keys(R.pickBy(compareAryCurried(ary), map)))

const atFn = obj => R.compose( R.values, R.pick(R.__, obj))

const getAtPipe = modalMap => R.apply(R.pipe, R.chain(atFn)(modalMap)) // modalKeys

const isIntersectionFn = ary => R.compose( R.length, R.intersection(ary))

const findFirstModalKeyCurried = R.curry((modalKeys, suffixList) => R.findIndex( isIntersectionFn(suffixList), modalKeys))

const getSortedModalCurried = R.move(R.__, 0, R.__)

const failModal = R.of('6')

const successModal = R.of('5')

let getSortModalsCurried = R.curry((modalMap, modalTypeSuffixMap, failModal, successModal, suffixList) => {
    if(R.isEmpty(suffixList)) return failModal

    const atModalMapPipe = getAtPipe(modalMap)
    
    let modalKeys = atWith(compareAryCurried, modalTypeSuffixMap, suffixList) // ['2', '4']
    
    if(R.isEmpty(modalKeys)) return failModal
    
    let modal = getSortedModalCurried(findFirstModalKeyCurried(atModalMapPipe(modalKeys), suffixList), modalKeys)
    
    return R.concat(modal, successModal)
  }
)

export const sortModals = getSortModalsCurried(modalMap, modalTypeSuffixMap, failModal, successModal)

export const getLabels = R.props(R.__, label)

const modals = sortModals(suffixList)
console.log(modals)
let labels = R.props(modals, label)
console.log(labels)

