import * as yup from 'yup'

export const configureYup = () => {
  yup.setLocale({
    string: {
      url: 'errors.invalidUrl',
    },
    mixed: {
      notOneOf: 'errors.exists',
    },
  })
}

export const buildSchema = urls =>
  yup.object().shape({
    url: yup.string().trim().required().url().notOneOf(urls),
  })
