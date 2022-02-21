<script>
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<template>
  <transition
    v-if="open"
    enter-active-class="duration-300 ease-out opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-200 ease-in"
    leave-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      class="fixed z-20 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-900 transition-opacity"
          aria-hidden="true"
        ></div>
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-screen-lg sm:w-full"
        >
          <div class="bg-white p4 sm:p-6">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
