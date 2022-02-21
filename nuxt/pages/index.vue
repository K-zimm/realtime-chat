<script>
import getMessages from '~/apollo/queries/messages/get'
import subscribeMessages from '~/apollo/queries/messages/subscribe'
import postMessage from '~/apollo/queries/messages/post'

export default {
  name: 'IndexPage',
  apollo: {
    messages: {
      prefetch: true,
      query: getMessages,
    },
    $subscribe: {
      messages: {
        query: subscribeMessages,
        result({ data, loading }) {
          this.loading = loading

          console.log(data)
          this.messages = data.messages
        },
        error(err) {
          this.$notify({
            message: `Fucked up: ${err.message}`,
            type: 'error',
          })
        },
      },
    },
  },
  data() {
    return {
      user: null,
      message: '',
    }
  },
  methods: {
    async sendMessage() {
      if (this.message.length > 0) {
        const payload = {
          user: this.$store.state.user.name,
          content: this.message,
        }
        await this.$apollo.mutate({ mutation: postMessage, variables: payload })
      }
      this.message = ''
    },
    keymonitor(event) {
      if (event.key === 'Enter') {
        this.sendMessage()
      }
    },
  },
  mount() {
    console.log(this.$apollo.subscriptions.messages)
    this.$apollo.subscriptions.messages.start()
  },
}
</script>

<template>
  <div>
    <SlotModal :open="!(typeof $store.state.user.name === 'string')">
      <h1 class="text-xl mb-4">Choose a user name</h1>
      <div class="flex">
        <input
          v-model="user"
          type="text"
          name="userName"
          id="userName"
          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block flex-grow sm:text-sm border-gray-300 rounded-md mr-3"
          placeholder="User Name"
        />
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="$store.commit('setUser', user)"
        >
          Chat it up
        </button>
      </div>
    </SlotModal>
    <div class="min-w-full min-h-screen flex justify-center items-center">
      <div class="max-w-screen-lg w-full bg-gray-200 p-4">
        <ChatMessages :messages="messages" />
        <div class="flex justify-end">
          <div class="flex items-start space-x-4 w-2/3">
            <div class="flex-shrink-0">
              <img
                class="inline-block h-10 w-10 rounded-full"
                :src="$store.state.user.image"
                alt=""
              />
            </div>
            <div class="min-w-0 flex-1">
              <div
                class="border-b border-gray-200 focus-within:border-indigo-600"
              >
                <label for="comment" class="sr-only">Add your comment</label>
                <textarea
                  v-model="message"
                  rows="3"
                  name="comment"
                  id="comment"
                  class="block w-full py-3 border-0 resize-none focus:ring-0 sm:text-sm"
                  placeholder="Add your comment..."
                  @keypress="keymonitor($event)"
                />
              </div>
              <div class="pt-2 flex justify-end">
                <div class="flex-shrink-0">
                  <button
                    type="submit"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    @click="sendMessage()"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
