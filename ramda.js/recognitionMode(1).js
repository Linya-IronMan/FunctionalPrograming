import * as R from 'ramda'
// 文件后缀模式匹配流程
/* 
  1. 匹配类型-后缀模式映射组，获取类型-后缀模式下标
  2. 根据后缀类型下标匹配排序规则，获取规则-类型下标
  3. 根据规则下标匹配规则类型获取规则-类型对象下标
  4. 根据判断规则-类型对象下标查找第一个包含已解析文件后缀类型组，获取排序下标
  5. 未获取到下标标识失败，返回失败模式标识组
  6. 获取到下标，则根据排序下标，对匹配到规则-类型对象下标进行排序，获得排序后的下标模式组
  7. 添加模式匹配成功标识模式
  8. 根据匹配到的下标模式组，获取对应的label
*/
// 压缩包解析获取的文件后缀类型组
let suffixList = ['csv', 'json', 'txt']
// suffixList = ['java']
// suffixList = []
// 类型-后缀模式映射组
const modalTypeSuffixMap = {
  "0": ["csv"],
  "1": ["avi", "mp4", "csv", "jpg", "jpeg", "png", "bmp", "json", "wav"],
  "2": ["csv", "jpeg", "jpg", "png", "bmp", "json", "npy", "txt", "xml"],
  "3": ["csv", "wav", "mp3"],
  "4": ["csv", "data", "json", "tsv", "txt"],
}
// 规则-类型 下标
const ModalType = {
  Table: 'Table',
  Video: 'Video',
  Image: 'Image',
  Audio: 'Audio',
  Txt: 'Txt',
}
// 规则-类型 映射组
const modalFeatureFileMap = {
  [ModalType.Table]: ["csv"],
  [ModalType.Video]: ["avi", "mp4"],
  [ModalType.Image]: ["jpeg", "jpg", "png", "bmp", "npy"],
  [ModalType.Audio]: ["wav", "mp3"],
  [ModalType.Txt]: ["json", "txt"],
};
// 排序规则
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

// 数组v是否包含数组ary
const compareAryCurried = R.curry((ary, v) => {
  const intersection = R.intersection(ary, v)
  return R.on(R.equals, R.length)(ary, intersection)
})

/** 
 * 返回函数，该函数根据对比函数来获取map的对象，最后返回keys
 * params: 比较函数，待比较数组，map对象
 * returns: curry
*/
const atWith = R.curry((compareAryCurried, map, ary) => R.keys(R.pickBy(compareAryCurried(ary), map)))

/** 
 * 返回函数，该函数返回待传入keys的获取obj-values的函数
 * params: obj
 * return: 待传入keys的函数
*/
const atFn = obj => R.compose(R.values, R.pick(R.__, obj))

/** 
 * 返回函数，该函数根据key依次匹配obj数组元素的值,返回最后一个元素values
 * params: obj数组
 * 注：R.chain返回传递给pipe调用的函数，包含一个或者多个函数
 * return: 待传入keys的pipe
*/
const getAtPipe = modalMap => R.apply(R.pipe, R.chain(atFn)(modalMap))

// 数组是否有交集
const isIntersectionFn = ary => R.compose(R.length, R.intersection(ary))

// 查找第一个匹配到的modal的key
const findFirstModalKeyCurried = R.curry((modalKeys, suffixList) => R.findIndex(isIntersectionFn(suffixList), modalKeys))

// 通过移动元素来排序
const getSortedModalCurried = R.move(R.__, 0, R.__)

// 匹配失败标识模式
const failModal = R.of('6')

// 匹配成功标识模式
const successModal = R.of('5')

/**
 * 根据后缀匹配模式
 * returns: 返回匹配的标识值数组
*/
let getSortModalsCurried = R.curry((modalMap, modalTypeSuffixMap, failModal, successModal, suffixList) => {
  if (R.isEmpty(suffixList)) return failModal
  
  let modalKeys = atWith(compareAryCurried, modalTypeSuffixMap, suffixList) // ['2', '4']
  
  if (R.isEmpty(modalKeys)) return failModal

  let modal = getSortedModalCurried(findFirstModalKeyCurried(getAtPipe(modalMap)(modalKeys), suffixList), modalKeys)

  return R.concat(modal, successModal)
})

export const sortModals = getSortModalsCurried(modalMap, modalTypeSuffixMap, failModal, successModal)

export const getLabels = R.props(R.__, label)

// const modals = sortModals(suffixList)
// console.log(modals)
// let labels = R.props(modals, label)
// console.log(labels)

