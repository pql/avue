<template>
  <div class="logo">
    <span>{{ $website.title }}</span>
    <i @click="switchTheme"
       class="iconfont icon-theme"></i>
  </div>
</template>

<script>
import { switchTheme } from '@avue/avue-data/utils/utils';
export default {
  methods: {
    switchTheme () {
      switchTheme(undefined, this);
    }
  }
}
</script>

<style>
</style>