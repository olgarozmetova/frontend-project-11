export const parseFeed = (xmlString) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'aplication/xml')

  const channel = doc.querySelector('channel')
  if (!channel) {
    throw new Error('parseError')
  }

  const feed = {
    title: channel.querySelector('title').textContent,
    description: channel.querySelector('description').textContent,
  }

  const items = [...doc.querySelectorAll('item')]

  const posts = items.map(item => ({
    title: item.querySelector('title').textContent,
    link: item.querySelector('link').textContent,
    description: item.querySelector('description').textContent,
  }))

  return { feed, posts }
}
