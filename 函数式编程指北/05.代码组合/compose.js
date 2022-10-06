import {compose} from 'ramda'
import {replace} from '../utils.js';

const snakeCase = word => word.toLowerCase().replace(/\s+/ig, '_');

const snakecas = compose(replace(/s+/ig, '_'))

