<template>
  <div
    tabindex="-1"
    class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 flex justify-center h-screen items-center bg-gray-900/70 antialiased">
    <div
      class="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto rounded-lg border border-gray-300 shadow-xl">
      <div
        class="flex flex-row justify-between p-6 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg">
        <h3 class="text-xl font-semibold text-gray-900">
          <slot name="header">Modal</slot>
        </h3>
        <button
          type="button"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          @click="$emit('close')">
          <svg-icon name="plus" class="!w-5 !h-5 rotate-45" />
          <span class="sr-only">Close modal</span>
        </button>
      </div>

      <div class="flex flex-col p-6 space-y-3 bg-white">
        <slot name="content"> Body </slot>
      </div>

      <div
        class="flex flex-row items-center justify-between p-5 bg-white border-t border-gray-200 rounded-bl-lg rounded-br-lg">
        <slot name="footer">
          <BaseButton variant="clear" @click="$emit('close')">
            Cancel
          </BaseButton>
          <BaseButton variant="primary" @click="$emit('submit')">
            Submit
          </BaseButton>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from './common/BaseButton.vue'

export default {
  name: 'Modal',

  components: { BaseButton },
}
</script>
