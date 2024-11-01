<template>
  <div :class="[b(),className]"
       :style="styleSizeName"
       @mouseenter="handleMouseEnter"
       @mouseleave="handleMouseLeave"
       @dblclick="handleDblClick"
       @click="handleClick">
    <div v-loading="loading"
         element-loading-background="rgba(0, 0, 0, 0)">
      <component v-if="reload"
                 :style="styleSizeName"
                 :scale="scale"
                 :backgroundAlpha="0"
                 backgroundColor="#000"
                 :rotation="rotation"
                 :is="type"
                 :src="src"
                 @on-load="onLoad" />
    </div>
  </div>
</template>

<script>

import create from "../../create";
import { ModelCollada, ModelFbx, ModelGltf, ModelThree, ModelObj, ModelPly, ModelStl, } from 'vue-3d-model';

export default create({
  name: "3dmodel",
  components: {
    ModelCollada, ModelFbx, ModelGltf, ModelThree, ModelObj, ModelPly, ModelStl,
  },
  data () {
    return {
      reload: false,
      loading: false,
      check: null,
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    };
  },
  watch: {
    scale: {
      handler () {
        this.init()
      },
      immediate: true,
      deep: true
    },
    width: {
      handler () {
        this.init()
      },
      immediate: true,
    },
    height: {
      handler () {
        this.init()
      },
      immediate: true,
    },
    x: {
      handler () {
        this.rotation.x = this.option.x || 0
        this.init()
      },
      immediate: true,
    },
    y: {
      handler () {
        this.rotation.y = this.option.y || 0
        this.init()
      },
      immediate: true,
    },
    z: {
      handler () {
        this.rotation.z = this.option.z || 0
        this.init()
      },
      immediate: true,
    },
    rotate: {
      handler () {
        this.init()
      },
      immediate: true,
    },
    src: {
      handler () {
        this.init()
      },
      immediate: true,
    },
    type: {
      handler () {
        this.init()
      },
      immediate: true,
    }
  },
  computed: {
    scale () {
      return {
        x: this.option.scale || 1,
        y: this.option.scale || 1,
        z: this.option.scale || 1,
      }
    },
    rotate () {
      return this.option.rotate
    },
    x () {
      return this.option.x
    },
    y () {
      return this.option.y
    },
    z () {
      return this.option.z
    },
    src () {
      return this.option.src
    },
    type () {
      return this.option.type
    }
  },
  methods: {
    init () {
      this.reload = false
      this.$nextTick(() => {
        this.reload = true;
        this.showLoad()
      })
    },
    showLoad () {
      this.loading = true
    },
    hideLoad () {
      this.loading = false
    },
    onLoad (d) {
      if (this.check) cancelAnimationFrame(this.check);
      if (this.rotate) this.rotateFun()
      this.hideLoad();
    },
    rotateFun () {
      this.check = requestAnimationFrame(this.rotateFun);
      this.rotation[this.option.position || 'y'] += 0.01;
    },
  }
});

</script>
