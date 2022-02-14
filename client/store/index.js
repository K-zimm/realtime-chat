export const state = () => ({
  user: {
    name: null,
    image: 'https://picsum.photos/50',
  },
})

export const mutations = {
  setUser(state, userName) {
    state.user.name = userName
  },
}
