import './style.css'

import { initI18n } from './i18n.js'
import { configureYup, buildSchema } from './validation.js'
import { initView } from './view.js'

initI18n()
  .then(() => {
    configureYup()

    const state = {
      feeds: [],
      form: {
        status: 'filling',
        error: null,
      },
    }

    const elements = {
      form: document.querySelector('.rss-form'),
      input: document.querySelector('#url-input'),
      feedback: document.querySelector('.feedback'),
    }

    const watched = initView(state, elements)

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault()

      const formData = new FormData(e.target)
      const url = formData.get('url').trim()

      const data = { url }
      const schema = buildSchema(watched.feeds)

      watched.form.status = 'filling'
      watched.form.error = null

      schema
        .validate(data)
        .then(({ url }) => {
          // successful
          watched.feeds.push(url)
          watched.form.status = 'success'
        })
        .catch((err) => {
          // errors
          watched.form.status = 'invalid'
          watched.form.error = err.message
        })
    })
  })
  .catch((err) => {
    console.error('Ошибка инициализации i18next:', err)
  })
