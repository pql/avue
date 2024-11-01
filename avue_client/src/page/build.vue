<template>
  <div class="build">
    <contentmenu ref="contentmenu"></contentmenu>
    <imglist ref="imglist"
             @change="handleSetimg"></imglist>
    <headers ref="headers"></headers>
    <top ref="top"></top>
    <div class="app"
         :class="{'app--none':!menuFlag}">
      <div class="aside">
        <div class="item"
             :class="{'is-active':menuShow}"
             @click="$refs.headers.handleFlag('menuShow')">
          <i class="iconfont icon-tuceng"></i>
          <span>图层</span>
        </div>
        <div class="item"
             :class="{'is-active':paramsShow}"
             @click="$refs.headers.handleFlag('paramsShow')">
          <i class="iconfont icon-peizhi"></i>
          <span>配置</span>
        </div>
        <div class="item"
             v-for="(item,index) in asideMenu"
             :key="index"
             :class="{'is-active':aside==index}"
             @click="setAside(item,index)">
          <i class="iconfont"
             :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </div>
        <div class="item"
             @click="handleOpenImg(null,'file')">
          <i class="iconfont icon-accesst"></i>
          <span>资源库</span>
        </div>
      </div>
      <div class="menu"
           :style="{width:setPx(this.menuParams.menuWidth)}"
           v-show="menuFlag&&menuShow"
           @click.stop="handleInitActive">
        <div class="menu__drag"
             ref="menuDrag"
             @mousedown="handleDrag($event,'menu')"></div>
        <div class="menu_header  title">
          <div class="title_box">
            <span>
              图层({{list.length}})
              <i class="el-icon-caret-top"
                 @click="$refs.layer.handleRefresh()"></i>
            </span>
            <div class="title_menu">
              <div class="head_btn"
                   :class="{'head_btn--active':layerType==0}"
                   @click="layerType=0">
                <i class="el-icon-monitor"></i>
              </div>
              <div class="head_btn"
                   :class="{'head_btn--active':layerType==1}"
                   @click="layerType=1">
                <i class="el-icon-coin"></i>
              </div>
            </div>
          </div>
        </div>
        <el-scrollbar ref="menuScroll"
                      class="menu__scrollbar">
          <layer ref="layer"
                 :type="layerType"
                 style="padding:0 5px;"
                 :nav="nav"></layer>
        </el-scrollbar>
      </div>
      <div class="menu"
           v-if="!validatenull(aside)"
           :style="{width:setPx(this.menuParams.defaultWidth)}">
        <div class="menu__drag"
             ref="defaultDrag"
             @mousedown="handleDrag($event,'default')"></div>
        <div class="menu_header  title">
          <div class="title_box">
            <span>{{asideTitle}}</span>
          </div>
        </div>
        <div style="margin-top: 40px;height:100%;">
          <group v-if="aside==0"></group>
          <variable v-else-if="aside==1"></variable>
          <filters v-else-if="aside==2"></filters>
          <func v-else-if="aside==3"></func>
          <theme v-else-if="aside==4"></theme>
          <fonts-list v-else-if="aside==5"></fonts-list>
          <zutai-list v-else-if="aside==6"></zutai-list>
        </div>
      </div>
      <!-- 中间区域 -->
      <div ref="sectionRef"
           id="section"
           :class="{'screens-drag':dragFlag}"
           @mousedown="dragMousedown"
           @mouseup="dragMouseup"
           @mousemove="dragMousemove"
           class="section"
           @contextmenu.prevent="()=>{}">
        <div class="refer-line-img"
             @click="imgClick">
          <img :src="isShowReferLine?imgOpenData:imgClose">
        </div>
        <sketch-rule :thick="thick"
                     :scale="scale"
                     :width="width"
                     :height="height"
                     :startX="startX"
                     :startY="startY"
                     :key="sketchReload"
                     :isShowReferLine="isShowReferLine"
                     :palette="palette"
                     :shadow="shadow"
                     :horLineArr="lines.h"
                     :verLineArr="lines.v" />
        <div ref='screensRef'
             class="screens"
             @wheel="handleWheel"
             @scroll="handleScroll">
          <div ref="containerRef"
               class="screen-container">
            <div class="canvas"
                 ref="canvasRef"
                 :style="canvasStyle">
              <container ref="container"></container>
            </div>
          </div>
        </div>
      </div>
      <div class="menu params"
           :style="{width:setPx(this.menuParams.paramsWidth)}"
           v-show="menuFlag&&paramsShow">
        <div class="menu__drag"
             ref="paramsDrag"
             @mousedown="handleDrag($event,'params')"
             :style="{left:'-4px'}"></div>
        <div class="menu_header">
          <el-tabs v-if="isMain"
                   class="menu__tabs"
                   stretch
                   v-model="menuTabs">
            <el-tab-pane name="0">
              <span slot="label"><i class="el-icon-setting"></i>配置</span>
            </el-tab-pane>
            <!-- 数据配置 -->
            <el-tab-pane name="1"
                         v-if="validProp('dataList')">
              <span slot="label"><i class="el-icon-document-copy"></i>数据</span>
            </el-tab-pane>
            <template v-if="!isFolder&&!validProp('notEventList')">
              <!-- 状态配置 -->
              <el-tab-pane name="2">
                <span slot="label"><i class="el-icon-thumb"></i>状态</span>

              </el-tab-pane>
              <!-- 其他事件配置 -->
              <el-tab-pane name="3">
                <span slot="label"><i class="el-icon-mouse"></i>事件</span>
              </el-tab-pane>
              <!-- 动画配置 -->
              <el-tab-pane name="4">
                <span slot="label"><i class="el-icon-film"></i>动画</span>
              </el-tab-pane>
            </template>

            <!-- 基本参数配置 -->
            <el-tab-pane name="5">
              <span slot="label"><i class="el-icon-folder"></i>其它</span>
            </el-tab-pane>
          </el-tabs>
          <p class="title"
             v-if="isMain">{{activeObj.title}}（{{activeObj.name}}）</p>
        </div>
        <el-scrollbar class="menu__scrollbar"
                      :style="scrollStyleName">
          <template v-if="menuTabs==0">
            <el-form label-width="110px"
                     label-position="left"
                     size="small">
              <!-- 多选配置选项 -->
              <template v-if="isSelectActive">
                <el-form-item label="水平对齐">
                  <ul class="menu__button">
                    <li @click="$refs.contentmenu.handlePostionSelect('left')">
                      <el-tooltip content="左对齐"
                                  placement="top">
                        <el-button size="mini">
                          <svg-icon icon-class="pos1" />
                        </el-button>
                      </el-tooltip>
                    </li>
                    <li @click="$refs.contentmenu.handlePostionSelect('center')">
                      <el-tooltip content="水平对齐"
                                  placement="top">
                        <el-button size="mini">
                          <svg-icon icon-class="pos5" />
                        </el-button>
                      </el-tooltip>
                    </li>
                    <li @click="$refs.contentmenu.handlePostionSelect('right')">
                      <el-tooltip content="右对齐"
                                  placement="top">
                        <el-button size="mini">
                          <svg-icon icon-class="pos3" />
                        </el-button>
                      </el-tooltip>
                    </li>
                  </ul>
                </el-form-item>
                <el-form-item label="垂直对齐">
                  <ul class="menu__button">
                    <li @click="$refs.contentmenu.handlePostionSelect('top')">
                      <el-tooltip content="顶部对齐"
                                  placement="top">
                        <el-button size="mini">
                          <svg-icon icon-class="pos4" />
                        </el-button>
                      </el-tooltip>
                    </li>
                    <li @click="$refs.contentmenu.handlePostionSelect('middle')">
                      <el-tooltip content="垂直对齐"
                                  placement="top">
                        <el-button size="mini">
                          <svg-icon icon-class="pos2" />
                        </el-button>
                      </el-tooltip>
                    </li>
                    <li @click="$refs.contentmenu.handlePostionSelect('bottom')">
                      <el-tooltip content="底部对齐"
                                  placement="top">
                        <el-button size="mini">
                          <svg-icon icon-class="pos6" />
                        </el-button>
                      </el-tooltip>
                    </li>
                  </ul>
                </el-form-item>
                <el-form-item label-width="0">
                  <el-button type="primary"
                             size="small"
                             class="block"
                             @click="$refs.contentmenu.handleCompose">成组</el-button>
                </el-form-item>
                <el-form-item label-width="0">
                  <el-button type="danger"
                             size="small"
                             class="block"
                             @click="$refs.contentmenu.handleDel">删除</el-button>
                </el-form-item>
                <el-form-item label=""
                              label-width="0px">
                  <monaco-editor v-model="activeObjList"
                                 disabled
                                 @click.native="handleCopy(JSON.stringify(activeObjList,null,4))"
                                 language="javascript"
                                 height="400"></monaco-editor>
                </el-form-item>
              </template>
              <!-- 组件配置 -->
              <template v-else-if="activeIndex">
                <el-form-item label="图层名称">
                  <avue-input v-model="activeObj.name"></avue-input>
                </el-form-item>
                <el-form-item label="隐藏">
                  <avue-switch v-model="activeObj.display"
                               @change="({value})=>handleParams('display', null, value)"></avue-switch>
                </el-form-item>
                <el-form-item label="锁定">
                  <avue-switch v-model="activeObj.lock"
                               @change="({value})=>handleParams('lock', null, value)"></avue-switch>
                </el-form-item>
                <el-collapse v-if="isFolder">
                  <el-collapse-item title="轮播（预览模式生效）">
                    <el-form-item label="开启">
                      <avue-switch v-model="activeObj.auto"
                                   @change="({value})=>handleParams('auto', null, value)"></avue-switch>
                    </el-form-item>
                    <template v-if="activeObj.auto">
                      <el-form-item label="初始化序号">
                        <el-input v-model="activeObj.autoInitialIndex"
                                  placeholder="默认0"> </el-input>
                      </el-form-item>
                      <el-form-item label="时间">
                        <el-input v-model="activeObj.autoInterval"
                                  placeholder="3000">
                          <span slot="append">毫秒</span>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="类型">
                        <avue-select v-model="activeObj.autoType"
                                     :dic="[{label:'普通',value:''},{label:'卡片',value:'card'}]"
                                     placeholder="请选择类型"> </avue-select>
                      </el-form-item>
                      <el-form-item label="自动切换">
                        <avue-select v-model="activeObj.autoAutoplay"
                                     :dic="[{label:'是',value:true},{label:'否',value:false}]"
                                     placeholder="请选择自动切换"> </avue-select>
                      </el-form-item>
                      <el-form-item label="方向">
                        <avue-select v-model="activeObj.autoDirection"
                                     :dic="[{label:'横',value:'horizontal'},{label:'竖',value:'vertical'}]"
                                     placeholder="请选择方向"> </avue-select>
                      </el-form-item>
                      <el-form-item label="箭头">
                        <avue-select v-model="activeObj.autoArrow"
                                     :dic="[{label:'总显示',value:'always'},{label:'移动显示',value:'hover'},{label:'不显示',value:'never'}]"
                                     placeholder="请选择箭头"> </avue-select>
                      </el-form-item>
                      <el-form-item label="指示器">
                        <avue-select v-model="activeObj.autoIndicatorPosition"
                                     :dic="[{label:'不显示',value:'none'},{label:'显示',value:'outside'}]"
                                     placeholder="请选择指示器"> </avue-select>
                      </el-form-item>
                    </template>

                  </el-collapse-item>
                  <el-form-item label-width="0">
                    <el-button type="primary"
                               size="small"
                               class="block"
                               @click="$refs.contentmenu.handleLogout">解散</el-button>
                  </el-form-item>
                  <el-form-item label-width="0">
                    <el-button type="danger"
                               size="small"
                               class="block"
                               @click="$refs.contentmenu.handleLogout">删除</el-button>
                  </el-form-item>
                </el-collapse>
                <template v-if="validProp('colorList')">
                  <el-form-item label="系统配色">
                    <avue-switch v-model="activeOption.switchTheme"></avue-switch>
                  </el-form-item>
                </template>
                <el-form-item label="SVG渲染"
                              v-if="validProp('echartList')">
                  <avue-switch v-model="activeOption.renderer"></avue-switch>
                </el-form-item>
                <component :is="activeComponent.prop+'Option'"></component>
                <main-option></main-option>
              </template>
              <!-- 主屏的配置项 -->
              <template v-else>
                <el-tabs class="menu__tabs"
                         stretch
                         v-model="mainTabs">
                  <el-tab-pane label="组态配置"
                               name="0">
                    <el-collapse accordion>
                      <el-form-item label="尺寸">
                        <div class="flex">
                          <avue-input-number v-model="config.width"></avue-input-number>
                          &nbsp;x&nbsp;
                          <avue-input-number v-model="config.height"></avue-input-number>
                        </div>
                      </el-form-item>
                      <el-form-item label="简介">
                        <avue-input v-model="config.info"
                                    type="textarea"
                                    :min-rows="5"></avue-input>
                      </el-form-item>
                      <el-form-item label="背景颜色">
                        <avue-input-color v-model="config.backgroundColor"></avue-input-color>
                      </el-form-item>
                      <el-form-item label="背景图片">
                        <img :src="config.backgroundImage"
                             @click="handleOpenImg('config.backgroundImage','background')"
                             alt=""
                             width="100%" />
                        <el-input clearable
                                  v-model="config.backgroundImage">
                          <div @click="handleOpenImg('config.backgroundImage','background')"
                               slot="append">
                            <i class="iconfont icon-img"></i>
                          </div>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="适配方式">
                        <el-radio-group v-model="config.screen"
                                        size="mini">
                          <el-radio-button label="x">
                            <el-tooltip content="X轴铺满，Y轴自适应滚动"
                                        placement="top">
                              <svg-icon icon-class="fix2" />
                            </el-tooltip>
                          </el-radio-button>
                          <el-radio-button label="y">
                            <el-tooltip content="Y轴铺满，X轴自适应滚动"
                                        placement="top">
                              <svg-icon icon-class="fix3" />
                            </el-tooltip>
                          </el-radio-button>
                          <el-radio-button label="xy">
                            <el-tooltip content="强行拉伸画面，填充所有视图"
                                        placement="top">
                              <svg-icon icon-class="fix4" />
                            </el-tooltip>
                          </el-radio-button>
                        </el-radio-group>
                      </el-form-item>
                      <el-collapse-item title="辅助">
                        <el-form-item label="文件夹穿透">
                          <avue-switch v-model="config.folderDeep"></avue-switch>
                        </el-form-item>
                        <el-form-item label="超出隐藏">
                          <avue-switch v-model="config.overflow"></avue-switch>
                        </el-form-item>
                        <el-form-item label="辅助网格">
                          <avue-switch v-model="config.gradeShow"></avue-switch>
                        </el-form-item>
                        <el-form-item label="辅助线">
                          <avue-switch v-model="config.toolShow"></avue-switch>
                        </el-form-item>
                      </el-collapse-item>
                      <el-collapse-item title="滤镜">
                        <el-form-item label="开启">
                          <avue-switch size="small"
                                       v-model="config.styles.show"></avue-switch>
                        </el-form-item>
                        <template v-if="config.styles.show">
                          <el-form-item label="对比度">
                            <avue-slider v-model="config.styles.contrast"
                                         :max="400"></avue-slider>
                          </el-form-item>
                          <el-form-item label="饱和度">
                            <avue-slider v-model="config.styles.saturate"
                                         :max="400"></avue-slider>
                          </el-form-item>
                          <el-form-item label="亮度">
                            <avue-slider v-model="config.styles.brightness"
                                         :max="400"></avue-slider>
                          </el-form-item>
                          <el-form-item label="透明度">
                            <avue-slider v-model="config.styles.opacity"
                                         :max="100"></avue-slider>
                          </el-form-item>
                          <el-form-item label="灰度">
                            <avue-slider v-model="config.styles.grayscale"
                                         :max="400"></avue-slider>
                          </el-form-item>
                          <el-form-item label="色相">
                            <avue-slider v-model="config.styles.hueRotate"
                                         :max="1000"></avue-slider>
                          </el-form-item>
                          <el-form-item label="反转">
                            <avue-slider v-model="config.styles.invert"
                                         :max="400"></avue-slider>
                          </el-form-item>
                          <el-form-item label="模糊">
                            <avue-slider v-model="config.styles.blur"
                                         :max="100"></avue-slider>
                          </el-form-item>
                        </template>
                      </el-collapse-item>
                      <el-collapse-item title="水印（预览模式生效）">
                        <el-form-item label="开启">
                          <avue-switch v-model="config.mark.show"></avue-switch>
                        </el-form-item>
                        <template v-if="config.mark.show">
                          <el-form-item label="内容">
                            <avue-input v-model="config.mark.text"
                                        placeholder="请输入水印内容"></avue-input>
                          </el-form-item>
                          <el-form-item label="大小">
                            <avue-input-number v-model="config.mark.fontSize"></avue-input-number>
                          </el-form-item>
                          <el-form-item label="颜色">
                            <avue-input-color v-model="config.mark.color"></avue-input-color>
                          </el-form-item>
                          <el-form-item label="角度">
                            <avue-input-number v-model="config.mark.degree"></avue-input-number>
                          </el-form-item>
                        </template>
                      </el-collapse-item>
                      <el-form-item label-width="0">
                        <el-button size="small"
                                   type="primary"
                                   class="block"
                                   @click="$refs.glob.box=true">更多设置</el-button>
                      </el-form-item>
                    </el-collapse>
                  </el-tab-pane>
                </el-tabs>
              </template>
            </el-form>
          </template>
          <template v-else-if="menuTabs==1">
            <dataindex ref="dataindex"></dataindex>
          </template>
          <template v-else-if="menuTabs==2">
            <transfer ref="transfer"></transfer>
          </template>
          <template v-else-if="menuTabs==3">
            <event ref="event"></event>
          </template>
          <template v-else-if="menuTabs==4">
            <anima ref="anima"></anima>
          </template>
          <template v-else-if="menuTabs==5">
            <el-form label-width="90px"
                     label-position="left"
                     size="small">
              <el-form-item label="序号">
                <avue-input readonly
                            @click="handleCopy(activeIndex)"
                            v-model="activeIndex">
                </avue-input>
              </el-form-item>
              <el-form-item label="分组">
                <div class="avue-flex">
                  <el-select v-model="newGroup">
                    <el-option :key="index"
                               :label="item.name"
                               v-for="(item,index) in config.group"
                               :value="item.id"></el-option>
                  </el-select>
                  &nbsp;
                  <el-button type="primary"
                             @click="handleMoveGroup">移动</el-button>
                </div>
              </el-form-item>
              <options v-if="!isFolder"></options>
              <el-form-item label=""
                            label-width="0px">
                <monaco-editor v-model="activeObj"
                               disabled
                               @click.native="handleCopy(JSON.stringify(activeObj,null,4))"
                               language="javascript"
                               height="200"></monaco-editor>
              </el-form-item>
            </el-form>
          </template>
        </el-scrollbar>
      </div>
    </div>
    <codeedit @submit="closeCode"
              v-if="code.box"
              :title="code.title"
              :type="code.type"
              :codeType="code.codeType"
              v-model="code.obj"
              :visible.sync="code.box"></codeedit>
    <glob ref="glob"></glob>
    <excel ref="excel"></excel>
  </div>
</template>
<script>

import MonacoEditor from '@avue/avue-data/page/components/monaco-editor'
import layer from '@avue/avue-data/page/group/layer';
import top from '@avue/avue-data/page/group/top';
import glob from '@avue/avue-data/page/setup/glob'
import event from '@avue/avue-data/page/setup/event'
import transfer from '@avue/avue-data/page/setup/transfer'
import options from '@avue/avue-data/page/setup/options'
import group from '@avue/avue-data/page/setup/group'
import excel from '@avue/avue-data/page/setup/excel'
import theme from '@avue/avue-data/page/setup/theme'
import filters from '@avue/avue-data/page/setup/filters'
import func from '@avue/avue-data/page/setup/func'
import variable from '@avue/avue-data/page/setup/variable'
import dataindex from '@avue/avue-data/page/setup/dataindex'
import fontsList from '@avue/avue-data/page/setup/fonts'
import zutaiList from '@avue/avue-data/iot/file'
import anima from '@avue/avue-data/page/setup/anima'
import imglist from '@avue/avue-data/page/setup/imglist'
import contentmenu from '@avue/avue-data/page/setup/contentmenu'
import headers from '@avue/avue-data/page/group/header';
import codeedit from '@avue/avue-data/page/group/code';
import { dicOption } from '@avue/avue-data/option/config'
import init from '@avue/avue-data/mixins/'
import components from '@avue/avue-data/option/components'
import SketchRule from "vue-sketch-ruler";

export default {
  mixins: [init, components],
  data () {
    return {
      sketchReload: Math.random(),
      aside: null,
      asideTitle: '',
      asideMenu: [{
        label: '屏幕',
        icon: 'icon-pingmu'
      }, {
        label: '变量',
        icon: 'icon-glob'
      }, {
        label: '过滤器',
        icon: 'icon-filter'
      }, {
        label: '函数',
        icon: 'icon-func'
      }, {
        label: '主题',
        icon: 'icon-theme'
      }, {
        label: '字体',
        icon: 'icon-fonts'
      }, {
        label: '组态',
        icon: 'icon-zutai'
      }],
      newGroup: '',
      layerType: 0,
      currentHistoryIndex: -1,
      menuId: 'avue-data-menu',
      menuShow: true,
      paramsShow: true,
      show: false,
      cacheList: {
        timer: null,
        nav: null,
        copy: null,
        data: null,
        history: [],
        action: null,
        event: null,
      },
      keys: {
        ctrl: false,
        space: false
      },
      nav: [],
      loading: '',
      key: '',
      menuParams: {
        defaultWidth: 300,
        menuWidth: 200,
        paramsWidth: 330,
      },
      menuFlag: true,
      code: {
        codeType: '',
        title: '',
        box: false,
        type: '',
        obj: '',
      },
      form: {},
      dicOption: dicOption,
      mainTabs: 0,
      menuTabs: 0,
      //拖拽
      dragFlag: false,
      dragEvent: null,
      dragStartX: null,
      dragStartY: null,
      // 标尺
      width: document.body.clientWidth,
      height: document.body.clientHeight,
      scale: 1,
      startX: 0,
      startY: 0,
      palette: {
        bgColor: '#202023',
        longfgColor: '#BABBBC',
        shortfgColor: '#9C9C9C',
        fontColor: '#919398',
        shadowColor: '#18181c',
        lineColor: '#2681ff',
        borderColor: '#B5B5B5',
        cornerActiveColor: '#fff',
      },
      lines: {
        h: [],
        v: []
      },
      thick: 20,
      isShowReferLine: true,
      imgOpenData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAbCAYAAAAOEM1uAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAQNSURBVHja7JdvSON1HMdfP126/shSmaZ1ntuZbTLihOnSdJlPhIquB0VR1DZM9En0wCB3qCXKVOh86mmakdGDOqyHityBidYN1HPYZqbhOZprMGTOUk/9/XryWyxvek5NIu4Lg/H+fPj8Xt/P98/n8xUkSeK/PIT7gP8GoCAI8cTQAoWAHkgFRCAA3AKmgeBRA8VkOSZgMvAy8DZQCqQf4OcFRoDPgYmzAnwdaAAuxpFlCbgGfAR4ThUwYhcE4QngExnw71FWVuax2WwBk8mkSE9PV+7t7Ymrq6vbw8PD0uDgYO7CwsK5KPc14ENJkj497FtxAwqCYAK+kvcbANXV1U6Hw6HIyMh4GlAckJHwzMzMrM1my3a5XNoo01XgPUmSdk8MCLwEfAmoAPLz872jo6OrOTk5xVGBQ0tLS575+fnt7OzsRIPBcD4pKelctL2/v3+mtrbWLIpigixfA94BNk8C+JoMlyRn7WZvb68mISEhI+IQCASmKyoq0jweT25EU6lU4aGhoZnKykpzdNzl5eWbRqPxyWAwmCZL3wJvAHeOA/iCPMsHARwOx7jdbi+JXs7t7e3lrKys1LW1NVWsJXa73ZN6vb40WltfX3cbDIZ0r9ebKUv9wLvxAhYC1+V7je7u7rG6urrn9vu1tbWNNzU1lR90KgsLC5emp6cfB5TRejgc9mg0msyoTNYDXfEAjgFmQGxpaZlobm6OBbFrMpl+dTqd+YdcLztbW1ve5ORk7X6D3++f0ul0+aFQKAXYAF6RJOn6UQGDQBrgE0VRJQjCw7EAjUbj8tTUVN4hgLubm5u3lUrlhVjG+vr6ya6ursgWaJck6fJRAW8AzwNia2vrRGNjY8xltNvtEx0dHc8eRKfX62+73W418NB+m8/nm9LpdE+Fw+FHgD+AS/Fk8CJwI7IHe3t7x2pqau7agxsbG/NqtTp3a2tLGQtwcnJyvKSk5K7JhcPhnzQaTXYwGEyVpQ+AK8c5xd9EZt/e3v59Q0ND6f5LeXFx8cfy8vILfr9fHdEUCsVOX1/fhMViqdgfOxQKzRUUFKh9Pt+JTnHk76vyPZgcqR49PT3nExMTM/+x0XZ3fePj47/Mzc2RlZVFVVVVRkpKin5/3JWVFWdRUVFeIBCInN7v5NJ55ySV5EUZ8lEArVb728jIiDcvL++ZONqo0MDAwK2ampoyURQTZXlI7ob+PI1aXAR8AegiutVqdXZ2dt6zFs/OzrosFstjLpcr+iR3A+9LkrRzKs2CrGUCV4C3on3NZrPHarX+Xlxc/MARu5nLkiRdPbVuJsa4BDQCxjj6QRH4GvgY+PksOmqF3FG/KVcc9T066s+AH86y5Y8eOXI282XQyJtkRv6d/pvk/rPz/wT41wBibRrpeMs+PAAAAABJRU5ErkJggg==', // 左上角图片
      imgClose: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAPYSURBVHja7JVPTFRXFIe/+96gGRHEhQzBFMJKSKSkLTgtGxemSXcktohW2RBmTAjUClIYZ6Cxi+fQDgOCLJgJhqTSBAtLdjaxaSqQWnDSNp2U0I6FFh0SDdV0oMx7pwuZCUXjnyZNuvBsbnLvufe7555zfleJCP+1qReQfwVRSqWmqoFDIE3A+iZXQDbGlMmmNTatP5xPn/0ohOOgLgNtIB8DOlAKvAzsBTKBP4FF4Dvge1DrzwsBaAAuAJ8CxbpuezU/P397QcFLZGVlcf/+fRYXF1lc/G3VNJM/AJ8Dw8CdZ4QoQI4AIWBXaWkpQ0ND5v79+zW73Z5+n9XVVWZnb8rExIQ2MnKZWCz2M/Dhw1d4eiTngXafz2dmZ2ebPp9P6+vrl5qaI2p8fFyi0aheUlJiHj78tpaTs0sHJB6PW4HAJ3og0I2I+AHPkyAeu91uDA4OmrW1tRpAT09vsr29XXM4ciWZTJKXl2ctLCyoHTsy1ZUro+J0OjNSWR8ZGbFcLpeeSCTOAucfBykDpvr7+7c3NjamS+bevXvJ4uIS4vE7tra2tjW/32+7ffu21Ne7rJmZb7VIJKL27Nmjp0ADAwM0NjauAW+IyM2tkAGn8/WG69e/NjVNS20iHA6vd3Z2qrq6OtMwDFswGLROnz6dcffu3WRRUZEVCARwuVzbUv6WZVmVlZXa9PT0RRFp2gq56na7Dw0ODv6jGc6cOWNdu/Zl8saNb/RgMGi1tLSo7u5uaW5u1srLK8yDBw/aursD2ubmcbtPqnA4dFVE3twKuVBeXv7e5OSkabPZ0pGEQuG/WltbicV+0Xbv3m0LBnvWW1qatbNnvclLl4b0c+c+ErfblcoLa2trptPp1CORSEBEWrdCSoBpwzB2ejyedE6Wl5fNsrIyqaiokFAopBwOh/J4PKbf79/mcDiS0WiUnJwcWyoKr9erDMNYBg6ISOxx1dWg6/pAb2+vtZF8DWBqanr96NEalUgkpKCgQJaWljRN04jH43R1dcmpU6dsgBiGobxer3qoGnz2pD5pBfx1dXWaz+czi4qKNECtrKyYY2NjVjQa1fftK7aqq99hdHRUmpqaVEdHhzU/P58xPDycAN4Hws8iK28B/tzc3LJjx96lqqrKOnCggszMzLRmPHjwQM3MzFj19fX63NwcwDJQBUymK+ApEEDtBDkOnFBKvZafv9deWFhIdnYWKysr3Lr1K0tLvydE5CvgJ1AnQZqBi88DSV1aA0qAV4CCDRX+A1gAZoEfN/w/ALqAEyAjzwvZ8mc8KukblgGqD/gCZOyxkBd//P8G8vcAMK383pmr7aEAAAAASUVORK5CYII=',
    }
  },
  components: {
    MonacoEditor,
    imglist,
    fontsList,
    zutaiList,
    layer,
    event,
    transfer,
    codeedit,
    excel,
    top,
    theme,
    glob,
    headers,
    options,
    filters,
    func,
    anima,
    variable,
    dataindex,
    group,
    contentmenu,
    SketchRule
  },
  computed: {
    activeObjList () {
      let list = []
      this.active.forEach(index => {
        let item = this.findnav(index);
        list.push(item.item)
      })
      return list;
    },
    isMain () {
      return this.isActive && !this.isSelectActive
    },
    scrollStyleName () {
      let calc = this.setPx(!this.isMain ? 2 : 85)
      return { paddingTop: calc }
    },
    shadow () {
      return {
        x: 0,
        y: 0,
        width: this.width,
        height: this.height
      }
    },
    // 能否撤销
    canUndo () {
      return this.currentHistoryIndex > 0
    },
    canRedo () {
      return this.cacheList.history.length > this.currentHistoryIndex + 1
    },
    isKeysCtrl () {
      return this.keys.ctrl == true
    },
    isFolder () {
      return this.activeObj.children
    },
    isActive () {
      return this.activeIndex
    },
    isSelectActive () {
      return this.active.length > 1;
    },
    activeComponent () {
      return this.activeObj.component || {}
    },
    activeOption () {
      return this.activeObj.option || {}
    },
    activeObj () {
      let item = this.findList(this.activeIndex) || {}
      if (!item.child) item.child = {}
      if (!item.transfer) item.transfer = {}
      return item
    },
    activeList () {
      let result = []
      this.active.forEach(ele => {
        let item = this.findnav(ele);
        result.push(item.item);
      })
      return result
    },
    canvasStyle () {
      return {
        width: this.setPx(this.canvasWidth),
        height: this.setPx(this.canvasHeight),
        transform: `scale(${this.scale})`,
        overflow: this.config.overflow ? 'hidden' : ''
      }
    }
  },
  watch: {
    nav: {
      handler (val) {
        this.recordHistoryCache(val)
      },
      deep: true
    },
    activeObj: {
      handler () {
        this.newGroup = this.group
      },
      deep: true
    },
    activeOverIndex (n, o) {
      [o, n].forEach((ele, index) => {
        if (!ele) return
        this.setActive(ele, index === 1, 'setOverActive');
      })
    },
    activeIndex () {
      // 初始化选项卡
      this.menuTabs = '0';
    },
    active (n, o) {
      [o, n].forEach((ele, index) => {
        ele.forEach(item => {
          this.setActive(item, index === 1, 'setActive');
        })
      })
    },
  },
  mounted () {
    setTimeout(() => {
      this.initFun()
      this.initSize()
      this.listenKey();
    })
  },
  methods: {
    handleResetView (select = true) {
      this.$nextTick(() => {
        if (select) this.handleInitActive();
        const screensRect = this.$refs.screensRef.getBoundingClientRect();
        this.setScale(screensRect.width);
      })
    },
    setAside (item, index) {
      this.asideTitle = item.label
      this.aside = index == this.aside ? null : index
      this.handleResetView(false)
    },
    handleMenuScroll (value) {
      this.$refs.menuScroll.wrap.scrollTop = value
    },
    handleMoveGroup () {
      this.$confirm(`是否移动到对应屏幕?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let { itemList, itemIndex } = this.findnav(this.activeIndex);
        let obj = itemList.splice(itemIndex, 1)[0];
        if (obj.children) {
          obj.children.forEach(ele => {
            ele.group = this.newGroup;
          })
        }
        obj.group = this.newGroup;
        this.nav.unshift(obj);
        this.handleInitActive()
        this.mainTabs = '1';
      })
    },
    dragMousedown (e) {
      this.handleInitActive()
      this.dragFlag = true
      this.dragEvent = e
      this.dragStartX = this.$refs.screensRef.scrollLeft
      this.dragStartY = this.$refs.screensRef.scrollTop
    },
    dragMouseup () {
      this.dragFlag = false
    },
    dragMousemove (e) {
      if (this.dragFlag) {
        let x = e.clientX - this.dragEvent.clientX
        let y = e.clientY - this.dragEvent.clientY
        this.$refs.screensRef.scrollLeft = this.dragStartX - x
        this.$refs.screensRef.scrollTop = this.dragStartY - y
      }
    },
    handleDrag (e, name) {
      let resize = this.$refs[name + 'Drag']
      if (!resize) return
      let startX = e.clientX;
      document.onmousemove = (e) => {
        let endX = e.clientX;
        let moveLen = endX - startX;
        startX = endX;
        this.menuParams[name + 'Width'] += name == 'params' ? -moveLen : moveLen
        this.$refs.headers.handleSet(false)
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
      return false;
    },
    handleCopy (data) {
      this.$Clipboard({
        text: data
      }).then(() => {
        this.$message.success('复制成功')
      }).catch(() => {
        this.$message.error('复制失败')
      });
    },
    handleRefresh () {
      return this.$refs.container.handleRefresh();
    },
    handleParams (type, obj, val) {
      const deepList = (list, flag) => {
        list.forEach(ele => {
          ele[type] = flag
          if (ele.children) deepList(ele.children, flag);
        })
      }
      if (obj) {
        let value = this.validatenull(val) ? !obj[type] : val
        obj[type] = value
        deepList([obj], value)
      } else {
        this.active.forEach(ele => {
          let { item } = this.findnav(ele)
          if (!item) return
          let value = this.validatenull(val) ? !item[type] : val
          item[type] = value
          deepList([item], value)
        })
      }
      this.validatenull(val) && this.handleInitActive()
    },
    closeCode (value) {
      if (this.configData.includes(this.code.type)) {
        this.config[this.code.type] = value;
      } else {
        this.activeObj[this.code.type] = value;
      }
      this.$refs.dataindex.handleRes(false)
    },
    openCode (type, title) {
      if (type == 'data') {
        this.code.codeType = 'mock'
      } else {
        this.code.codeType = ''
      }
      this.code.type = type;
      this.code.title = title
      if (this.configData.includes(type)) {
        this.code.obj = this.config[type];
      } else {
        this.code.obj = this.activeObj[type];
      }
      this.code.box = true;
    },
    initFun () {
      ['setScale'].forEach(ele => {
        this[ele] = this.$refs.container[ele]
      })
    },
    // 右键菜单
    handleContextMenu (item = {}, done) {
      if (!item.index || this.isKeysCtrl) return
      else if (!this.isSelectActive) {
        this.active = [item.index];
        this.activeIndex = item.index;
      }
      done()
    },
    //监听键盘的按键
    listenKey () {
      let sectionRef = this.$refs.sectionRef;
      sectionRef.onkeydown = (e) => {
        const keyCode = e.keyCode;
        if (keyCode == 76 && this.isKeysCtrl) {
          if (!this.activeObj) return
          this.handleParams('lock')
        } else if (keyCode == 67 && this.isKeysCtrl) {
          if (!this.activeObj) return
          this.$refs.contentmenu.handleCopy1()
        } else if (keyCode == 86 && this.isKeysCtrl) {
          this.$refs.contentmenu.handlePaste()
        } else if (keyCode == 88 && this.isKeysCtrl) {
          this.$refs.contentmenu.handleShear()
        } else if (keyCode == 8 || keyCode == 46) {
          this.$refs.contentmenu.handleDel();
        }
      }
      sectionRef.onkeyup = (e) => {
        const keyCode = e.keyCode;
      }
      document.onkeydown = (e) => {
        const keyCode = e.keyCode;
        var elm = e.srcElement || e.target;
        const validElm = (elm.tagName.toLowerCase() == "input" && elm.type.toLowerCase() == "text" || elm.tagName.toLowerCase() == "textarea") && elm.parentNode.className !== 'el-input avue-draggable__focus'
        if (keyCode == 32) {
          this.keys.space = true
          if (validElm) return;
          e.preventDefault()
        } else if (keyCode == 17 || keyCode == 91) {
          this.keys.ctrl = true
          if (validElm) return;
        } else if (keyCode == 90 && this.isKeysCtrl) {
          if (validElm) return;
          this.editorUndo()
          e.preventDefault()
        } else if (keyCode == 89 && this.isKeysCtrl) {
          if (validElm) return;
          this.editorRedo()
          e.preventDefault()
        } else if (keyCode == 83 && this.isKeysCtrl) {
          if (validElm) return;
          this.$refs.headers.handleBuild();
          e.preventDefault()
        }
      }
      document.onkeyup = (e) => {
        const keyCode = e.keyCode;
        if (keyCode == 32) {
          this.keys.space = false
        } else if (keyCode == 17 || keyCode == 91) {
          this.keys.ctrl = false
        }
      }
    },
    setActive (val, result, fun) {
      const obj = this.$refs.container.getListRef(val);
      if (obj) obj[fun](result, true)
    },
    validProp (name) {
      return this.dicOption[name].includes(this.activeComponent.prop)
    },
    formatTooltip (val) {
      return parseInt(val);
    },
    //打开图库
    handleOpenImg (item, type) {
      this.$refs.imglist.openImg(item, type);
    },
    //图库框回调赋值
    handleSetimg (val, type) {
      let params = type.split('.')[1];
      if (type.includes('config')) {
        this.config[params] = val;
      } else if (type.includes('activeObj.data.value')) {
        this.activeObj.data.value = val;
      } else if (type.includes('activeObj.data')) {
        this.activeObj.data = val;
      } else if (type.includes('activeObj')) {
        this.activeObj[params] = val;
      } else if (type.includes('activeOption')) {
        this.activeOption[params] = val;
      }
    },
    handleScroll () {
      this.$nextTick(() => {
        const screensRect = this.$refs.screensRef.getBoundingClientRect();
        const canvasRect = this.$refs.canvasRef.getBoundingClientRect();
        // 标尺开始的刻度
        const startX = (screensRect.left + this.thick - canvasRect.left) / this.scale;
        const startY = (screensRect.top + this.thick - canvasRect.top) / this.scale;
        this.startX = startX >> 0;
        this.startY = startY >> 0;
      })
    },
    // 控制缩放值
    handleWheel (e) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const nextScale = parseFloat(
          Math.max(0.2, this.scale - e.deltaY / 500).toFixed(2)
        );
        this.scale = nextScale;
      }
      this.$nextTick(() => {
        this.handleScroll();
      });
    },
    // 初始化标尺数值
    initSize () {
      // 滚动居中
      let containerRect = this.$refs.containerRef.getBoundingClientRect()
      this.$refs.screensRef.scrollLeft = containerRect.width / 2 - this.thick * 2
      this.$refs.screensRef.scrollTop = containerRect.height / 2 - this.thick * 2
      this.$nextTick(() => {
        this.handleScroll();
      });
    },
    // 图片点击事件
    imgClick () {
      this.isShowReferLine = !this.isShowReferLine
    },
    selectNav (item) {
      if (this.isKeysCtrl) {
        if (Array.isArray(item)) {
          this.active = this.active.concat(item)
        } else {
          this.active.push(item);
        }
      } if (Array.isArray(item)) {
        this.active = item;
        this.activeIndex = item[item.length - 1];
      } else if (this.active.includes(item)) {
        this.activeIndex = item;
      } else {
        this.active = [item];
        this.activeIndex = item;
      }
    },
    recordHistoryCache (val) {
      const debounce = (func, delay) => {
        return () => {
          let context = this;
          let args = arguments;
          clearTimeout(this.cacheList.timer);
          this.cacheList.timer = setTimeout(() => {
            func.apply(context, args);
          }, delay);
        }
      }
      const callback = () => {
        let nav = JSON.stringify(val)
        if (nav != this.cacheList.nav) {
          this.cacheList.nav = nav
          this.addHistoryCache(val)
        }
      }
      debounce(callback, 300)()
    },
    addHistoryCache (val) {
      if (this.currentHistoryIndex + 1 < this.cacheList.history.length) {
        this.cacheList.history.splice(this.currentHistoryIndex + 1)
      }
      this.cacheList.history.push({
        nav: this.deepClone(val),
      })
      this.cacheList.history.splice(100)
      this.currentHistoryIndex++
    },
    editorUndo () {
      if (!this.canUndo) {
        this.$message.warning('暂无可后退操作')
        return
      }
      this.currentHistoryIndex--
      this.recoveryHistoryCache()
    },
    editorRedo () {
      if (!this.canRedo) {
        this.$message.warning('暂时无可前进操作')
        return
      }
      this.currentHistoryIndex++
      this.recoveryHistoryCache()
    },
    recoveryHistoryCache () {
      const prevState = this.cacheList.history[this.currentHistoryIndex]
      this.nav = this.deepClone(prevState.nav)
      this.cacheList.nav = JSON.stringify(prevState.nav)
    }
  }
}
</script>
<style lang="scss">
@import '@avue/avue-data/styles/style.scss';
@import '@avue/avue-data/styles/list.scss';
</style>
