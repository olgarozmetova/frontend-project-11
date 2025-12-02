import onChange from 'on-change'
import i18next from 'i18next'

const renderFeeds = (feeds, feedsList) => {
  feedsList.innerHTML = ''
  if (feeds.length === 0) return

  feeds.forEach((feed) => {
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'border-0', 'rounded-0')
    li.innerHTML = `
      <h3 class="feed-title h6 m-0">${feed.title}</h3>
      <p class="m-0 small text-black-50">${feed.description}</p>
    `
    feedsList.appendChild(li)
  })
}

const renderPosts = (posts, postsList, readPosts) => {
  postsList.innerHTML = ''
  if (posts.length === 0) return

  posts.forEach((post) => {
    const li = document.createElement('li')
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    )

    const a = document.createElement('a')
    a.href = post.link
    a.target = '_blank'
    a.textContent = post.title
    a.classList.add(readPosts.has(post.id) ? 'fw-normal' : 'fw-bold')

    const button = document.createElement('button')
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
    button.textContent = 'Просмотр'
    button.dataset.id = post.id

    li.append(a, button)
    postsList.append(li)
  })
}

export const initView = (state, elements) => {
  const watched = onChange(state, (path, value) => {
    const { input, feedback, form, feedsList, postsList } = elements

    if (path === 'form.error') {
      if (value) {
        input.classList.add('is-invalid')
        feedback.classList.remove('text-success')
        feedback.classList.add('text-danger')
        feedback.textContent = i18next.t(value)
        let key = value
        if (value === 'network') {
          key = 'errors.network'
        }
        else if (value === 'parse') {
          key = 'errors.parse'
        }
        feedback.textContent = i18next.t(key)
      }
      else {
        input.classList.remove('is-invalid')
        feedback.textContent = ''
      }
    }

    if (path === 'form.status' && value === 'success') {
      feedback.classList.remove('text-danger')
      feedback.classList.add('text-success')
      feedback.textContent = i18next.t('form.success')

      form.reset()
      input.focus()
    }

    if (value === 'processing') {
      feedback.classList.remove('text-success')
      feedback.classList.remove('text-danger')
      feedback.textContent = i18next.t('form.loading')
    }

    if (path && (path === 'feeds' || path.startsWith('feeds'))) {
      renderFeeds(watched.feeds, feedsList)
    }

    if (
      path
      && (path === 'posts'
        || path.startsWith('posts')
        || path.startsWith('ui.readPosts'))
    ) {
      renderPosts(
        watched.posts,
        postsList,
        watched.ui.readPosts,
        watched.ui.modal,
        elements,
      )
    }

    if (path.startsWith('ui.modal')) {
      elements.modalTitle.textContent = watched.ui.modal.title
      elements.modalBody.textContent = watched.ui.modal.description
      elements.modalLink.href = watched.ui.modal.link
    }
  })

  renderFeeds(state.feeds, elements.feedsList)
  renderPosts(
    state.posts,
    elements.postsList,
    state.ui.readPosts,
    state.ui.modal,
    elements,
  )

  return watched
}
