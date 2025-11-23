const generateId = () =>
  `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`

export default generateId
