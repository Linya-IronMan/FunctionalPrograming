import _ from 'lodash'
let suffixList = ['csv', 'json', 'txt']
// let suffixList = ['csv', 'json']
const modalTypeSuffixMap = {
  "0": ["csv"],
  "1": ["avi", "mp4", "csv", "jpg", "jpeg", "png", "bmp","json","wav"],
  "2": ["csv","jpeg","jpg","png","bmp","json","npy","txt","xml"],
  "3": ["csv","wav","mp3"],
  "4": ["csv","data","json","tsv","txt"],
}
// 空值判断
// TODO:

// 生成与 ary 交集的数组长度的函数
let intersectionWithAryFlow = ary => _.flow([
  _.partial(_.intersection, ary),
  _.size
])

// 生成与 ary 交集和原值长度是否相等的函数
let includesAry = ary => _.flow([
  intersectionWithAryFlow(ary),
  _.partial(_.isEqual, _.size(ary))
])

// 获取 modalTypeSuffixMap 包含的值
const pickModalTypeSuffixMap = _.partial(_.pickBy, modalTypeSuffixMap)

const getModal = _.flow([
  (item) => r => includesAry(item)(r),
  pickModalTypeSuffixMap,
  _.keys
])
// let modal = getModal(suffixList)
// console.log('modal', modal)

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
// const modal = [2, 4]

let pickModalOrder = _.partial(_.pick, modalOrder)
let atModalFeatureFileMap = _.partial(_.at, modalFeatureFileMap)
let intersectionWithSuffixListFlow = intersectionWithAryFlow(suffixList)
let findKeyFn = _.partialRight(_.findKey, item => intersectionWithSuffixListFlow(item))
// 查找key
let findKeyFlow = _.flow([
  pickModalOrder,
  _.values,
  atModalFeatureFileMap,
  findKeyFn
])

// let modal = getModal(suffixList)
// console.log(findKeyFlow(modal), modal)

// 排序
let modalSort = (index, ary) => ary.unshift(ary.pop(index))

// 排序流程
let sortAction = modal => {
  let [fn, params] = _.over([
    modal => _.partialRight(modalSort, modal),
    findKeyFlow
  ])(modal)
  return fn(params)
}

// 整体流程
let suffixListRs = _(suffixList)
  .thru(getModal) // 转化为 modal
  .tap(sortAction) // 排序
  // TODO:
  // 附加模式 
  .value()
console.log('suffixListRs', suffixListRs)

const label = {
  0: '表格模态',
  1: '视频模态',
  2: '图像模态',
  3: '⾳频模态',
  4: '⽂本模态',
  5: '多模态',
  6: '⽆法识别',
}
let labels = _.at(label, suffixListRs)

console.log('labels', labels)




