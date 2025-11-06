import * as yup from 'yup'

export const buildSchema = urls =>
  yup.object().shape({
    url: yup.string().trim().required().url().notOneOf(urls),
  })
