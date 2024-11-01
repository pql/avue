let requireComponent = require.context('./packages', true, /\w+.(vue|js)$/)
let components = {}
requireComponent.keys().forEach(fileName => {
  const cmp = requireComponent(fileName).default
  if (cmp) components[cmp.name] = cmp
})
export default components