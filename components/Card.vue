<template>
  <div
    class="p-6 flex flex-col items-center justify-center min-w-[340px] rounded-[9px] bg-white">
    <h4 class="text-2xl font-medium text-gray-dark">Template</h4>

    <div class="flex flex-col items-center justify-center my-7">
      <div
        class="w-36 h-36 flex items-center justify-center bg-[#D3E6F8] rounded-full">
        <svg-icon name="id-card" class="!w-20 !h-20" />
      </div>
      <h3 class="mt-3 text-2xl font-medium text-gray-dark">
        {{ templateType.label }}
      </h3>
    </div>

    <button
      type="button"
      @click="$emit('create', type)"
      class="text-primary font-medium">
      Request {{ templateType.label }}
    </button>
  </div>
</template>

<script>
import { convertDocType } from '../utils'

export default {
  name: 'TemplateCard',

  props: {
    type: {
      type: String,
    },
  },

  data() {
    return {
      templateType: '',
    }
  },

  mounted() {
    this.templateType = convertDocType(this.type)
  },
}
</script>
