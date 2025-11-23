import axios from 'axios'

const buildProxyUrl = url =>
  `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
    url,
  )}`

export const loadFeed = (url) => {
  const proxyUrl = buildProxyUrl(url)

  return axios
    .get(proxyUrl)
    .then((res) => {
      return res.data.contents
    })
    .catch(() => {
      throw new Error('network')
    })
}
