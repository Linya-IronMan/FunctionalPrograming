import * as R from 'ramda';

const req = v => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(v);
        }, 1000);
    });
};

const returnText = R.identity;

const isZip = R.always(false);
// const isZip = R.always(true)

const andThen = R.curry((fn, v) => v.then(fn));

const promiseAll = v => Promise.all(v);

const res = R.compose(
    // R.andThen(R.identity),
    andThen(R.identity),
    promiseAll,
    R.map(R.ifElse(isZip, req, returnText))
);

res([1, 2, 3]).then(r => {
    console.log('res', r);
});

const fn = async (label, type, target) => {
    const getLabel = R.map(R.prop((R.__, label)));

    const setSuffixList = R.set(R.lensProp('suffixList'), R.__, target);
    const setModalMatched = R.set(R.lensProp('modalMatched'), R.__, target);
    const setModalMatchedLabel = R.set(
        R.lensProp('modalMatchedLabel'),
        R.__,
        target
    );

    if (type === 'simple') {
        return R.pipe(
            R.prop('file'),
            R.tap(setSuffixList),
            R.prop('name'),
            parseFileName,
            R.of,
            getMatchedModalBySimpleRules,
            R.tap(setModalMatched),
            getLabel,
            R.tap(setModalMatchedLabel),
            R.identity(target)
        )(target);
    } else {
        return R.pipe(
            R.prop('file'),
            R.tap(setSuffixList),
            fileSuffix,
            R.andThen(getMatchedModalByZipRules),
            R.andThen(R.tap(setModalMatched)),
            R.andThen(getLabel),
            R.andThen(R.tap(setModalMatchedLabel)),
            R.andThen(R.always(target)),
            R.otherwise(R.always(target))
        )(target);
    }
};
