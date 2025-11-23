const generateId = () =>
  `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`

export const parseFeed = (xmlString) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'text/xml')

  const channel = doc.querySelector('channel')
  if (!channel) {
    throw new Error('parse')
  }

  const feed = {
    id: generateId(),
    title: channel.querySelector('title').textContent,
    description: channel.querySelector('description').textContent,
  }

  const items = [...doc.querySelectorAll('item')]

  const posts = items.map(item => ({
    id: generateId(),
    feedId: feed.id,
    title: item.querySelector('title').textContent,
    link: item.querySelector('link').textContent,
    description: item.querySelector('description').textContent,
  }))

  return { feed, posts }
}
