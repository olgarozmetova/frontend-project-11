import './style.css'

import { initI18n } from './i18n.js'
import { configureYup, buildSchema } from './validation.js'
import { initView } from './view.js'
import { loadFeed } from './downloadFeed.js'
import { parseFeed } from './parser.js'

initI18n()
  .then(() => {
    configureYup()

    const state = {
      feeds: [],
      posts: [],
      form: {
        status: 'filling', // "processing", "failed", "success"
        error: null,
      },
    }

    const elements = {
      form: document.querySelector('.rss-form'),
      input: document.querySelector('#url-input'),
      feedback: document.querySelector('.feedback'),
      feedsList: document.querySelector('.feeds-list'),
      postsList: document.querySelector('.posts-list'),
    }

    const watched = initView(state, elements)

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault()

      const formData = new FormData(e.target)
      const url = formData.get('url').trim()

      const data = { url }
      const schema = buildSchema(watched.feeds.map(feed => feed.url))

      watched.form.status = 'processing'
      watched.form.error = null

      schema
        .validate(data)
        .then(({ url }) => loadFeed(url))
        .then(xml => parseFeed(xml))
        .then(({ feed, posts }) => {
          const normalizedFeed = {
            id: feed.id,
            url,
            title: feed.title,
            description: feed.description,
          }

          const normalizedPosts = posts.map(p => ({
            id: p.id,
            feedId: feed.id,
            title: p.title,
            link: p.link,
            description: p.description,
          }))

          // successful
          watched.feeds.push(normalizedFeed)
          watched.posts.push(...normalizedPosts)
          watched.form.status = 'success'
        })
        .catch((err) => {
          // errors
          watched.form.status = 'failed'
          watched.form.error = err.message
        })
    })
  })
  .catch((err) => {
    console.error('Ошибка инициализации i18next:', err)
  })
