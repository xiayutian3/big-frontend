import { defineRule } from 'vee-validate'
// eslint-disable-next-line @typescript-eslint/camelcase
import { required, email, min, length, max, confirmed, is_not } from '@vee-validate/rules'

defineRule('required', required)
defineRule('email', email)
defineRule('min', min)
defineRule('length', length)
defineRule('max', max)
defineRule('confirmed', confirmed)
defineRule('is_not', is_not)
