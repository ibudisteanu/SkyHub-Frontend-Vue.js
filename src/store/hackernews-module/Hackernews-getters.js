export default {
  // ids of the items that should be currently displayed based on
  // current list type and current pagination
  activeIds (state, getters, rootState) {
    const { activeType, itemsPerPage, lists } = state

    if (!activeType) {
      return []
    }

    console.log( state, getters, rootState);

    const page = Number(rootState.route.params.page) || 1
    const start = (page - 1) * itemsPerPage
    const end = page * itemsPerPage

    return lists[activeType].slice(start, end)
  },

  // items that should be currently displayed.
  // this Array may not be fully fetched.
  activeItems (state, getters) {
    return getters.activeIds.map(id => state.items[id]).filter(_ => _)
  }
}
