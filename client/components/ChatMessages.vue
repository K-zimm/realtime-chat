<script>
export default {
  props: {
    messages: {
      type: Array,
      required: true,
    },
  },
}
</script>
<template>
  <div>
    <ul role="list" class="py-4 space-y-2 sm:px-6 sm:space-y-4 lg:px-8">
      <li
        v-for="message in messages"
        :key="message.id"
        class="flex"
        :class="$store.state.user.name !== message.user ? '' : ' justify-end'"
      >
        <div
          class="px-4 py-6 shadow rounded-lg sm:px-6 w-2/3 relative"
          :class="
            $store.state.user.name !== message.user
              ? 'bg-gray-900 text-zinc-50'
              : 'bg-zinc-50 text-gray-900'
          "
        >
          <img
            :src="$store.state.user.image"
            :alt="`${$store.state.user.name} profile`"
            class="absolute -top-2 -left-2 w-8 h-8 rounded-full"
          />
          <div class="sm:flex sm:justify-between sm:items-baseline">
            <h3 class="text-base font-medium">
              <span>{{ message.user }}</span>
            </h3>
            <p class="mt-1 text-sm whitespace-nowrap sm:mt-0 sm:ml-3">
              <time :datetime="message.datetime">{{
                new Date(message.datetime).toLocaleString()
              }}</time>
            </p>
          </div>
          <div class="mt-4 space-y-6 text-sm">
            {{ message.content }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
