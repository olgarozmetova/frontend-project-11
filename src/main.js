import './style.css'
import * as bootstrap from 'bootstrap'

import { initI18n } from './i18n.js'
import { configureYup, buildSchema } from './validation.js'
import { initView } from './view.js'
import { loadFeed } from './downloadFeed.js'
import { parseFeed } from './parser.js'

export default function app() {
  initI18n()
    .then(() => {
      configureYup()

      const state = {
        feeds: [],
        posts: [],
        ui: {
          readPosts: new Set(),
          modal: {
            title: '',
            description: '',
            link: '',
          },
        },
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

        modalTitle: document.querySelector('.modal-title'),
        modalBody: document.querySelector('.modal-body'),
        modalLink: document.querySelector('#modal-read-full'),
        modalElement: document.querySelector('#modal'),
      }

      const watched = initView(state, elements)

      // Auto-update
      const updateFeeds = () => {
        const promises = watched.feeds.map(feed =>
          loadFeed(feed.url)
            .then(xml => parseFeed(xml))
            .then(({ posts }) => {
              const existingLinks = watched.posts
                .filter(p => p.feedId === feed.id)
                .map(p => p.link)

              const newPosts = posts.filter(
                p => !existingLinks.includes(p.link),
              )

              if (newPosts.length > 0) {
                watched.posts.push(...newPosts)
              }
            })
            .catch(() => {}),
        )

        Promise.all(promises).finally(() => {
          setTimeout(updateFeeds, 5000)
        })
      }

      // Form submit
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

            if (watched.feeds.length === 1) {
              updateFeeds()
            }
          })
          .catch((err) => {
            // errors
            watched.form.status = 'failed'
            watched.form.error = err.message
          })
      })

      // Processing clicks
      elements.postsList.addEventListener('click', (e) => {
        const postId = e.target.dataset.id
        if (!postId) return

        // Mark as read
        watched.ui.readPosts.add(postId)
        // Find id post
        const post = watched.posts.find(p => p.id === postId)
        // Update modal data
        watched.ui.modal.title = post.title
        watched.ui.modal.description = post.description
        watched.ui.modal.link = post.link
        // Open modal
        if (e.target.tagName === 'BUTTON') {
          const modal = new bootstrap.Modal(elements.modalElement)
          modal.show()
        }
      })
    })
    .catch((err) => {
      console.error('Ошибка инициализации i18next:', err)
    })
}
