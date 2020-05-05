import { extend, configure } from 'vee-validate'
import { required, email, min, length, confirmed, max } from 'vee-validate/dist/rules'
import { i18n } from './i18n'

configure({
  defaultMessage: (field, values) => {
    // override the field name.
    values._field_ = i18n.t(`fields.${field}`)

    return i18n.t(`validation.${values._rule_}`, values)
  }
})
extend('email', email)
extend('required', required)
extend('min', min)
extend('length', length)
extend('confirmed', confirmed)
extend('max', max)

// 非全数字的验证(自定义验证方法)
extend('isNotAllNumber', {
  validate: value => !/^[0-9]+$/.test(value)
})
