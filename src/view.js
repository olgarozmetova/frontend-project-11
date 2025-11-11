import onChange from 'on-change'
import i18next from 'i18next'

export const initView = (state, elements) => {
  const watched = onChange(state, (path, value) => {
    const { input, feedback, form } = elements

    if (path === 'form.error') {
      if (value) {
        input.classList.add('is-invalid')
        feedback.classList.remove('text-success')
        feedback.classList.add('text-danger')
        feedback.textContent = i18next.t(value)
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
  })

  return watched
}
