<!-- 3dmodel配置 -->
<template>
  <div>
    <el-form-item label="类型">
      <avue-select :dic="dic"
                   v-model="main.activeOption.type"
                   placeholder="请选择模型类型"></avue-select>
    </el-form-item>
    <el-form-item label="地址">
      <avue-input v-model="main.activeOption.src"
                  placeholder="请输入模型地址"></avue-input>
    </el-form-item>
    <el-form-item label="初始化位置">
      <avue-input-number v-model="main.activeOption.x"
                         placeholder="请输入x开始位置"></avue-input-number>
      <avue-input-number v-model="main.activeOption.y"
                         placeholder="请输入y开始位置"></avue-input-number>
      <avue-input-number v-model="main.activeOption.z"
                         placeholder="请输入z开始位置"></avue-input-number>
    </el-form-item>
    <el-form-item label="缩放">
      <avue-input-number v-model="main.activeOption.scale"></avue-input-number>
    </el-form-item>
    <el-form-item label="开启旋转">
      <avue-switch v-model="main.activeOption.rotate"></avue-switch>
    </el-form-item>
    <el-form-item label="旋转轴"
                  v-if="main.activeOption.rotate">
      <avue-select v-model="main.activeOption.position"
                   :dic="dic1"
                   placeholder="请选择旋转轴"></avue-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: '3dmodel',
  inject: ["main"],
  data () {
    return {
      dic: [
        { label: 'dae', value: 'ModelCollada' },
        { label: 'fbx', value: 'ModelFbx' },
        { label: 'gltf', value: 'ModelGltf' },
        { label: 'json', value: 'ModelThree' },
        { label: 'obj', value: 'ModelObj' },
        { label: 'ply', value: 'ModelPly' },
        { label: 'stl', value: 'ModelStl' }
      ],
      dic1: [
        { label: 'x轴', value: 'x' },
        { label: 'y轴', value: 'y' },
        { label: 'z轴', value: 'z' }
      ]
    }
  }
}
</script>

<style>
</style>