<template>
  <div class="config-panel">
    <div class="top-fix">
        <span v-for="item in tabs" :key="item.key" class="tab-item" :class="{'active':item.key === activeTab}"
              @click="activeTab=item.key">
          {{ item.title }}
        </span>
    </div>
    <div class="scroll-content">
      <div class="block-config" v-if="show">
        <!--图表配置-->
        <div v-if="activeTab==='tab1'">
          <!--指标卡配置-->
          <template v-if="isIndexCard">
            <gui-group group-name="基础属性">
              <gui-field label="指标标题">
                <b-input v-model="data.options.title" size="small" @on-change="emitValue" clearable></b-input>
              </gui-field>
              <gui-field label="指标尺寸">
                <gui-inline label="宽度">
                  <b-select v-model="data.options.width" size="small"
                            @on-change="emitValue">
                    <b-option v-for="(val,key) in widthMap2" :value="val" :key="key">{{ key }}</b-option>
                  </b-select>
                </gui-inline>
                <gui-inline label="高度">
                  <b-input-number v-model="data.options.height" size="small"
                                  @on-change="emitValue"></b-input-number>
                </gui-inline>
              </gui-field>
              <gui-field label="图标选择">
                <icon-select v-model="data.options.icon" size="small" @on-change="emitValue" stop-remove-scroll/>
              </gui-field>
              <gui-field label="图标大小">
                <b-input-number v-model="data.options.iconSize" size="small"
                                @on-change="emitValue"></b-input-number>
              </gui-field>
              <gui-field label="背景颜色">
                <b-color-picker v-model="data.options.backgroundColor" size="small" :colors="colorsIndex"
                                @on-change="emitValue"></b-color-picker>
              </gui-field>
            </gui-group>
          </template>
          <!--指标组配置-->
          <template v-else-if="isIndexGroup">
            <gui-group group-name="基础属性">
              <gui-field label="指标高度" label-width="65px">
                <b-input-number v-model="data.options.height" size="small"
                                @on-change="emitValue"></b-input-number>
              </gui-field>
            </gui-group>
            <gui-group group-name="指标配置">
              <div class="index-wrap">
                <draggable :list="data.options.groupList"
                           v-bind="{ group:'index-item', animation: 200, ghostClass:'ghost', handle:'.move-drag' }"
                           @end="onDragEnd"
                           @start="isDragging = true">
                  <transition-group type="transition" name="flip-list">
                    <div class="index-item" v-for="(item,index) in data.options.groupList" :key="index">
                      <div class="move-drag">
                        <b-icon name="ios-move" size="18" color="#1089ff"/>
                      </div>
                      <div class="remove-icon">
                        <b-icon name="ios-remove-circle-outline" size="18" color="#f5222d"
                                @click.native="removeEnumItem(index)"/>
                      </div>
                      <gui-field label="指标标题" label-width="65px">
                        <b-input v-model="data.options.groupList[index].title" size="small"
                                 @on-change="emitValue"></b-input>
                      </gui-field>
                      <gui-field label="图 标" label-width="65px">
                        <icon-select v-model="data.options.groupList[index].icon" size="small"
                                     @on-change="emitValue" stop-remove-scroll/>
                      </gui-field>
                      <div flex="box:mean">
                        <gui-field label="图标大小" label-width="65px">
                          <b-input-number v-model="data.options.groupList[index].iconSize" size="small"
                                          @on-change="emitValue"></b-input-number>
                        </gui-field>
                        <gui-field label="背景颜色" label-width="65px">
                          <b-color-picker v-model="data.options.groupList[index].backgroundColor"
                                          size="small" :colors="colorsIndex"
                                          @on-change="emitValue"></b-color-picker>
                        </gui-field>
                      </div>
                      <div flex="box:mean">
                        <gui-field label="指标值" label-width="65px">
                          <b-input-number v-model="data.options.groupList[index].value" size="small"
                                          @on-change="emitValue"></b-input-number>
                        </gui-field>
                        <gui-field label="指标字段" label-width="65px">
                          <b-select v-model="data.options.groupList[index].field" size="small" @on-change="emitValue"
                                    clearable>
                            <b-option label="count" value="count"></b-option>
                            <b-option label="avg" value="avg"></b-option>
                            <b-option label="sum" value="sum"></b-option>
                            <b-option label="max" value="max"></b-option>
                            <b-option label="min" value="min"></b-option>
                          </b-select>
                        </gui-field>
                      </div>
                    </div>
                  </transition-group>
                </draggable>
              </div>
              <div style="padding: 5px 5px 16px;">
                <b-button type="primary" dashed size="small" style="width: 100%;" @click="addIndex">新增指标</b-button>
              </div>
            </gui-group>
          </template>
          <!--常规图表配置-->
          <template v-else>
            <gui-group group-name="基础属性">
              <gui-field label="标题">
                <b-input v-model="data.options.title" size="small" @on-change="emitValue" clearable></b-input>
              </gui-field>
              <gui-field label="标题文本">
                <gui-inline label="字号">
                  <b-input-number v-model="data.options.titleStyle.fontSize" size="small"
                                  :min="14" :max="22" @on-change="emitValue"></b-input-number>
                </gui-inline>
                <gui-inline label="颜色">
                  <b-color-picker v-model="data.options.titleStyle.color" size="small" :colors="colorsGary"
                                  @on-change="emitValue"></b-color-picker>
                </gui-inline>
              </gui-field>
              <gui-field label="图表尺寸">
                <gui-inline label="宽度">
                  <b-select v-model="data.options.width" size="small"
                            @on-change="emitValue">
                    <b-option v-for="(val,key) in widthMap" :value="val" :key="key">{{ key }}</b-option>
                  </b-select>
                </gui-inline>
                <gui-inline label="高度">
                  <b-input-number v-model="data.options.height" size="small"
                                  @on-change="emitValue"></b-input-number>
                </gui-inline>
              </gui-field>
            </gui-group>
            <!--图表分类配置-->
            <b-collapse simple accordion v-model="activeConfig">
              <b-collapse-panel title="通用配置" name="grid">
                <template v-if="showGrid">
                  <gui-field label="上下边距">
                    <gui-inline label="顶部">
                      <b-input-number v-model="data.options.grid.top" size="small"
                                      :min="0" :max="60" @on-change="emitValue"></b-input-number>
                    </gui-inline>
                    <gui-inline label="底部">
                      <b-input-number v-model="data.options.grid.bottom" size="small"
                                      :min="0" :max="60" @on-change="emitValue"></b-input-number>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="左右边距">
                    <gui-inline label="左侧">
                      <b-input-number v-model="data.options.grid.left" size="small"
                                      :min="0" :max="60" @on-change="emitValue"></b-input-number>
                    </gui-inline>
                    <gui-inline label="右侧">
                      <b-input-number v-model="data.options.grid.right" size="small"
                                      :min="0" :max="60" @on-change="emitValue"></b-input-number>
                    </gui-inline>
                  </gui-field>
                </template>
                <gui-field label="悬停提示">
                  <b-checkbox v-model="data.options.tooltip.show" @on-change="emitValue"/>
                </gui-field>
              </b-collapse-panel>
              <b-collapse-panel title="图例" name="legend" v-if="data.options.legend">
                <gui-field label="是否显示">
                  <b-checkbox v-model="data.options.legend.show" @on-change="emitValue"></b-checkbox>
                </gui-field>
                <gui-field label="文本样式">
                  <gui-inline label="字号">
                    <b-input-number v-model="data.options.legend.textStyle.fontSize"
                                    size="small" :min="12" :max="20" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                  <gui-inline label="颜色">
                    <b-color-picker v-model="data.options.legend.textStyle.color" :colors="colorsGary"
                                    @on-change="emitValue" size="small"></b-color-picker>
                  </gui-inline>
                </gui-field>
                <gui-field label="图形设置">
                  <gui-inline label="宽度">
                    <b-input-number v-model="data.options.legend.itemWidth"
                                    size="small" :min="8" :max="25" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                  <gui-inline label="高度">
                    <b-input-number v-model="data.options.legend.itemHeight"
                                    size="small" :min="8" :max="25" @on-change="emitValue"></b-input-number>
                  </gui-inline>
                  <gui-inline label="图形">
                    <b-select v-model="data.options.legend.icon"
                              placeholder="默认" clearable
                              @on-change="emitValue" size="small">
                      <b-option value="circle">圆形</b-option>
                      <b-option value="roundRect">矩形</b-option>
                      <b-option value="triangle">三角</b-option>
                      <b-option value="diamond">菱形</b-option>
                    </b-select>
                  </gui-inline>
                </gui-field>
              </b-collapse-panel>
              <!--x轴-->
              <b-collapse-panel title="x轴" name="xAxis" v-if="showXAxis">
                <gui-wrap label="坐标轴" v-model="data.options.xAxis.show" @on-change="emitValue">
                  <gui-field label="标题">
                    <gui-inline label="标题名称">
                      <b-input v-model="data.options.xAxis.name" size="small" clearable
                               @on-change="emitValue"></b-input>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <b-color-picker v-model="data.options.xAxis.nameTextStyle.color" :colors="colorsGary"
                                      @on-change="emitValue" size="small"></b-color-picker>
                    </gui-inline>
                  </gui-field>
                </gui-wrap>
                <gui-wrap label="轴线" v-model="data.options.xAxis.axisLine.show" @on-change="emitValue">
                  <gui-field label="颜色">
                    <b-color-picker v-model="data.options.xAxis.axisLine.lineStyle.color"
                                    placement="bottom-start" :colors="colorsGary"
                                    @on-change="emitValue" size="small"></b-color-picker>
                  </gui-field>
                </gui-wrap>
                <gui-wrap label="刻度" v-model="data.options.xAxis.axisTick.show" @on-change="emitValue">
                  <gui-field label="颜色">
                    <b-color-picker v-model="data.options.xAxis.axisTick.lineStyle.color"
                                    placement="bottom-start" :colors="colorsGary"
                                    style="margin-right: 24px;"
                                    @on-change="emitValue" size="small"></b-color-picker>
                    <b-checkbox v-model="data.options.xAxis.axisTick.alignWithLabel"
                                v-if="isLine||isHistogram" size="small" @on-change="emitValue">
                      标签刻度对齐
                    </b-checkbox>
                  </gui-field>
                </gui-wrap>
                <gui-wrap label="标签" v-model="data.options.xAxis.axisLabel.show" @on-change="emitValue">
                  <gui-field label="样式">
                    <gui-inline label="字号">
                      <b-input-number v-model="data.options.xAxis.axisLabel.fontSize"
                                      size="small" :min="12" :max="20" @on-change="emitValue"></b-input-number>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <b-color-picker v-model="data.options.xAxis.axisLabel.color" :colors="colorsGary"
                                      @on-change="emitValue" size="small"></b-color-picker>
                    </gui-inline>
                  </gui-field>
                </gui-wrap>
                <gui-wrap label="网格线" v-model="data.options.xAxis.splitLine.show" @on-change="emitValue">
                  <gui-field label="颜色">
                    <b-color-picker v-model="data.options.xAxis.splitLine.lineStyle.color"
                                    placement="bottom-start" :colors="colorsGary"
                                    @on-change="emitValue" size="small"></b-color-picker>
                  </gui-field>
                </gui-wrap>
              </b-collapse-panel>
              <!--y轴-->
              <b-collapse-panel title="y轴" name="yAxis" v-if="showYAxis">
                <gui-wrap label="坐标轴" v-model="data.options.yAxis.show" @on-change="emitValue">
                  <gui-field label="标题">
                    <gui-inline label="标题名称">
                      <b-input v-model="data.options.yAxis.name" size="small" clearable
                               @on-change="emitValue"></b-input>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <b-color-picker v-model="data.options.yAxis.nameTextStyle.color" :colors="colorsGary"
                                      @on-change="emitValue" size="small"></b-color-picker>
                    </gui-inline>
                  </gui-field>
                </gui-wrap>
                <gui-wrap label="轴线" v-model="data.options.yAxis.axisLine.show"
                          @on-change="emitValue">
                  <gui-field label="颜色">
                    <b-color-picker v-model="data.options.yAxis.axisLine.lineStyle.color"
                                    placement="bottom-start" :colors="colorsGary"
                                    @on-change="emitValue" size="small"></b-color-picker>
                  </gui-field>
                </gui-wrap>
                <gui-wrap label="刻度" v-model="data.options.yAxis.axisTick.show" @on-change="emitValue">
                  <gui-field label="颜色">
                    <b-color-picker v-model="data.options.yAxis.axisTick.lineStyle.color"
                                    placement="bottom-start" :colors="colorsGary"
                                    style="margin-right: 24px;"
                                    @on-change="emitValue" size="small"></b-color-picker>
                    <b-checkbox v-model="data.options.yAxis.axisTick.alignWithLabel"
                                v-if="isBar" size="small" @on-change="emitValue">
                      标签刻度对齐
                    </b-checkbox>
                  </gui-field>
                </gui-wrap>
                <gui-wrap label="标签" v-model="data.options.yAxis.axisLabel.show" @on-change="emitValue">
                  <gui-field label="样式">
                    <gui-inline label="字号">
                      <b-input-number v-model="data.options.yAxis.axisLabel.fontSize"
                                      size="small" :min="12" :max="20" @on-change="emitValue"></b-input-number>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <b-color-picker v-model="data.options.yAxis.axisLabel.color" :colors="colorsGary"
                                      @on-change="emitValue" size="small"></b-color-picker>
                    </gui-inline>
                  </gui-field>
                </gui-wrap>
                <gui-wrap label="网格线" v-model="data.options.yAxis.splitLine.show"
                          @on-change="emitValue">
                  <gui-field label="颜色">
                    <b-color-picker v-model="data.options.yAxis.splitLine.lineStyle.color"
                                    placement="bottom-start" :colors="colorsGary"
                                    @on-change="emitValue" size="small"></b-color-picker>
                  </gui-field>
                </gui-wrap>
              </b-collapse-panel>
              <!--雷达图独有-->
              <b-collapse-panel title="坐标系" name="radar" v-if="isRadar">
                <gui-field label="中心坐标">
                  <gui-inline label="offsetX">
                    <b-input v-model="data.options.radar.center[0]" size="small"
                             placeholder="支持百分比或像素" @on-change="emitValue"></b-input>
                  </gui-inline>
                  <gui-inline label="offsetY">
                    <b-input v-model="data.options.radar.center[1]" size="small"
                             placeholder="支持百分比或像素" @on-change="emitValue"></b-input>
                  </gui-inline>
                </gui-field>
                <gui-field label="图形">
                  <gui-inline label="雷达图半径">
                    <b-input v-model="data.options.radar.radius" size="small" @on-change="emitValue"></b-input>
                  </gui-inline>
                  <gui-inline label="雷达图类型">
                    <b-select v-model="data.options.radar.shape" @on-change="emitValue" size="small">
                      <b-option value="circle">圆形</b-option>
                      <b-option value="polygon">多边形</b-option>
                    </b-select>
                  </gui-inline>
                </gui-field>
              </b-collapse-panel>
              <!--地图独有-->
              <template v-if="isMap">
                <b-collapse-panel title="视觉映射" name="map">
                  <gui-field label="是否显示">
                    <b-switch v-model="data.options.visualMap.show" size="small" @on-change="emitValue"></b-switch>
                  </gui-field>
                  <gui-field label="样式">
                    <gui-inline label="类型">
                      <b-select v-model="data.options.visualMap.type" size="small"
                                @on-change="visualMapChange" :value="data.options.visualMap.type">
                        <b-option label="分段型" value="piecewise"></b-option>
                        <b-option label="连续型" value="continuous"></b-option>
                      </b-select>
                    </gui-inline>
                    <template v-if="data.options.visualMap.type==='piecewise'">
                      <gui-inline label="字号">
                        <b-input-number v-model="data.options.visualMap.textStyle.fontSize" size="small"
                                        :min="12" :max="20" @on-change="emitValue"></b-input-number>
                      </gui-inline>
                      <gui-inline label="颜色">
                        <b-color-picker v-model="data.options.visualMap.textStyle.color"
                                        :colors="colorsGary" size="small" @on-change="emitValue"></b-color-picker>
                      </gui-inline>
                    </template>
                    <template v-else>
                      <gui-inline label="宽度">
                        <b-input-number v-model="data.options.visualMap.itemWidth" size="small"
                                        :min="10" :max="20" @on-change="emitValue"></b-input-number>
                      </gui-inline>
                      <gui-inline label="高度">
                        <b-input-number v-model="data.options.visualMap.itemHeight" size="small"
                                        :min="10" :max="140" @on-change="emitValue"></b-input-number>
                      </gui-inline>
                    </template>
                  </gui-field>
                  <gui-field label="极值">
                    <gui-inline label="最小值">
                      <b-input-number v-model="data.options.visualMap.min" size="small" :min="0"
                                      @on-change="emitValue"></b-input-number>
                    </gui-inline>
                    <gui-inline label="最大值">
                      <b-input-number v-model="data.options.visualMap.max" size="small" :min="0"
                                      @on-change="emitValue"></b-input-number>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="图元大小">
                    <gui-inline label="最小值">
                      <b-input-number v-model="data.options.visualMap.inRange.symbolSize[0]" size="small" :min="0"
                                      @on-change="emitValue"></b-input-number>
                    </gui-inline>
                    <gui-inline label="最大值">
                      <b-input-number v-model="data.options.visualMap.inRange.symbolSize[1]" size="small" :min="0"
                                      @on-change="emitValue"></b-input-number>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="图元颜色">
                    <div v-for="(c,index) of data.options.visualMap.inRange.color" :key="index+c"
                         style="display: inline-block;margin-right: 4px;">
                      <b-color-picker v-model="data.options.visualMap.inRange.color[index]"
                                      size="small" :colors="colors" @on-change="emitValue"></b-color-picker>
                    </div>
                  </gui-field>
                </b-collapse-panel>
                <b-collapse-panel title="地理坐标系" name="geo">
                  <gui-field label="视角缩放">
                    <v-slider v-model="data.options.geo.zoom" :min="1" :max="2" :step="0.1"
                              @on-change="emitValue">
                    </v-slider>
                  </gui-field>
                  <gui-wrap label="文本" v-model="data.options.geo.label.normal.show" @on-change="emitValue">
                    <gui-field label="文本">
                      <gui-inline label="字号">
                        <b-input-number v-model="data.options.geo.label.normal.fontSize" size="small"
                                        :min="12" :max="20" @on-change="emitValue"></b-input-number>
                      </gui-inline>
                      <gui-inline label="颜色">
                        <b-color-picker v-model="data.options.geo.label.normal.color"
                                        :colors="colorsGary" size="small"
                                        @on-change="emitValue"></b-color-picker>
                      </gui-inline>
                      <gui-inline label="高亮颜色">
                        <b-color-picker v-model="data.options.geo.label.emphasis.color"
                                        :colors="colorsGary" size="small"
                                        @on-change="emitValue"></b-color-picker>
                      </gui-inline>
                    </gui-field>
                  </gui-wrap>
                  <gui-field label="多边形">
                    <gui-inline label="区域颜色" style="width:auto;">
                      <b-color-picker v-model="data.options.geo.itemStyle.normal.areaColor" size="small"
                                      alpha :colors="colors" @on-change="emitValue"></b-color-picker>
                    </gui-inline>
                    <gui-inline label="边框颜色" style="width:auto;">
                      <b-color-picker v-model="data.options.geo.itemStyle.normal.borderColor" size="small"
                                      alpha :colors="colors" @on-change="emitValue"></b-color-picker>
                    </gui-inline>
                    <gui-inline label="高亮区域" style="width:auto;">
                      <b-color-picker v-model="data.options.geo.itemStyle.emphasis.areaColor" size="small"
                                      alpha :colors="colors" @on-change="emitValue"></b-color-picker>
                    </gui-inline>
                    <gui-inline label="高亮边框" style="width:auto;">
                      <b-color-picker v-model="data.options.geo.itemStyle.emphasis.borderColor" size="small"
                                      alpha :colors="colors" @on-change="emitValue"></b-color-picker>
                    </gui-inline>
                  </gui-field>
                </b-collapse-panel>
              </template>
              <!--数据系列-->
              <b-collapse-panel title="数据系列" name="series" v-if="data.options.series">
                <gui-field label="默认名称">
                  <b-input v-model="data.options.series.name" size="small" @on-change="emitValue" clearable></b-input>
                </gui-field>
                <gui-wrap label="指标" v-model="data.options.series.label.show" @on-change="emitValue">
                  <gui-field label="指标文本">
                    <gui-inline label="字号">
                      <b-input-number v-model="data.options.series.label.fontSize" size="small"
                                      :min="12" :max="40" @on-change="emitValue"></b-input-number>
                    </gui-inline>
                    <gui-inline label="位置">
                      <b-select v-model="data.options.series.label.position" size="small"
                                @on-change="emitValue">
                        <b-option label="inside" value="inside"></b-option>
                        <b-option v-if="isPie" label="outside" value="outside"></b-option>
                        <b-option v-else label="top" value="top"></b-option>
                      </b-select>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <b-color-picker v-model="data.options.series.label.color" size="small"
                                      @on-change="emitValue" :colors="colorsGary"></b-color-picker>
                    </gui-inline>
                  </gui-field>
                </gui-wrap>
                <gui-field label="区域透明度" v-if="isLine||isRadar">
                  <v-slider v-model="data.options.series.areaStyle.opacity" :max="0.5" :step="0.1"
                            @on-change="emitValue">
                  </v-slider>
                </gui-field>
                <gui-field label="近似曲线" v-if="isLine">
                  <b-switch v-model="data.options.series.smooth" size="small" @on-change="emitValue"></b-switch>
                </gui-field>
                <gui-field label="柱条宽度" v-if="isHistogram||isBar">
                  <div flex>
                    <b-input size="small" style="width:150px;" @on-change="emitValue"
                             v-model="data.options.series.barWidth" clearable/>
                    <b-button size="small" @click="autoClick">自适应</b-button>
                  </div>
                </gui-field>
                <!--饼图独有-->
                <template v-if="isPie">
                  <gui-field label="玫瑰图">
                    <b-switch v-model="data.options.series.roseType" size="small" @on-change="emitValue"/>
                  </gui-field>
                  <gui-field label="中心坐标">
                    <gui-inline label="offsetX">
                      <b-input v-model="data.options.series.center[0]" size="small"
                               placeholder="像素或百分比"
                               @on-change="emitValue"></b-input>
                    </gui-inline>
                    <gui-inline label="offsetY">
                      <b-input v-model="data.options.series.center[1]" size="small"
                               placeholder="像素或百分比%"
                               @on-change="emitValue"></b-input>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="饼图半径">
                    <gui-inline label="内半径">
                      <b-input v-model="data.options.series.radius[0]" size="small"
                               placeholder="像素或百分比"
                               @on-change="emitValue"></b-input>
                    </gui-inline>
                    <gui-inline label="外半径">
                      <b-input v-model="data.options.series.radius[1]" size="small"
                               placeholder="像素或百分比%"
                               @on-change="emitValue"></b-input>
                    </gui-inline>
                  </gui-field>
                </template>
                <!--地图独有-->
                <template v-if="isMap">
                  <gui-field label="类型">
                    <b-select v-model="data.options.series.type" size="small"
                              @change="emitValue" :value="data.options.series.type">
                      <b-option label="散点/气泡" value="scatter"></b-option>
                      <b-option label="动画气泡" value="effectScatter"></b-option>
                    </b-select>
                  </gui-field>
                  <gui-field label="涟漪动画" v-if="data.options.series.type==='effectScatter'">
                    <gui-inline label="最大缩放比">
                      <b-input-number v-model="data.options.series.rippleEffect.scale" size="small"
                                      :step="0.5" @on-change="emitValue"></b-input-number>
                    </gui-inline>
                    <gui-inline label="波纹方式">
                      <b-select v-model="data.options.series.rippleEffect.brushType" size="small"
                                @change="emitValue" :value="data.options.series.rippleEffect.brushType">
                        <b-option label="stroke" value="stroke"></b-option>
                        <b-option label="fill" value="fill"></b-option>
                      </b-select>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="气泡悬停">
                    <gui-inline label="边框宽度">
                      <b-input-number v-model="data.options.series.itemStyle.emphasis.borderWidth" size="small"
                                      :min="0" :max="2" @on-change="emitValue"></b-input-number>
                    </gui-inline>
                    <gui-inline label="边框颜色" style="width:auto;">
                      <b-color-picker v-model="data.options.series.itemStyle.emphasis.borderColor"
                                      size="small" :colors="colors"
                                      @on-change="emitValue"></b-color-picker>
                    </gui-inline>
                  </gui-field>
                </template>
              </b-collapse-panel>
              <!--调色盘颜色-->
              <b-collapse-panel title="调色盘颜色" name="colors" v-if="data.options.color">
                <div style="padding: 5px 13px;">
                  <div v-for="(c,index) of data.options.color" :key="index+c"
                       style="display: inline-block;margin-right: 4px;">
                    <b-color-picker v-model="data.options.color[index]" :colors="colors" size="small"
                                    @on-change="emitValue"></b-color-picker>
                  </div>
                </div>
              </b-collapse-panel>
            </b-collapse>
          </template>
        </div>
        <!--数据配置-->
        <div v-else>
          <!--指标卡配置\指标组配置-->
          <template v-if="isIndexCard||isIndexGroup">
            <gui-group group-name="数据配置">
              <gui-field label="数据来源">
                <b-switch v-model="data.isOpen" size="large" true-value="dynamic" false-value="static"
                          @on-change="emitValue">
                  <span slot="open">动态</span>
                  <span slot="close">静态</span>
                </b-switch>
              </gui-field>
              <gui-field v-if="isIndexCard&&data.isOpen==='static'" label="静态数据源">
                <b-input-number v-model="data.staticDataSource[0].value" style="width: 100%;" @on-change="emitValue"/>
              </gui-field>
            </gui-group>
            <template v-if="data.isOpen==='dynamic'">
              <gui-group group-name="模板接口">
                <div style="padding: 4px 12px;">
                  <data-source-select v-model="data.dataSource" :default-name="data.dataSourceName"
                                      @on-select="handleSetSourceParam" @on-clear="handleSetSourceParam"/>
                </div>
              </gui-group>
              <gui-group group-name="参数信息" v-if="data.dataSourceParam.length>0">
                <data-source-param v-model="data.dataSourceParam" @on-change="emitValue"/>
              </gui-group>
            </template>
          </template>
          <!--常规图表配置-->
          <template v-else>
            <gui-group group-name="数据映射">
              <gui-field label="字段映射">
                <gui-inline label="x轴字段">
                  <b-input v-model="data.options.sourceMap.xField" size="small" @on-change="emitValue"/>
                </gui-inline>
                <gui-inline label="y轴字段">
                  <b-input v-model="data.options.sourceMap.yField" size="small" @on-change="emitValue"/>
                </gui-inline>
                <gui-inline label="系列字段">
                  <b-input v-model="data.options.sourceMap.seriesField" size="small" @on-change="emitValue"/>
                </gui-inline>
              </gui-field>
              <gui-field label="数据来源">
                <b-switch v-model="data.isOpen" size="large" true-value="dynamic" false-value="static"
                          @on-change="emitValue">
                  <span slot="open">动态</span>
                  <span slot="close">静态</span>
                </b-switch>
              </gui-field>
            </gui-group>
            <gui-group v-if="data.isOpen==='static'" group-name="静态数据源">
              <b-ace-editor :value="JSON.stringify(data.staticDataSource,null,2)" height="500"
                            @on-change="staticDataChange"/>
            </gui-group>
          </template>
        </div>
      </div>
      <b-empty v-else>暂未选择图表</b-empty>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { isNotEmpty } from '@/common/utils/assist'
import GuiWrap from './gui/gui-wrap'
import GuiGroup from './gui/gui-group'
import GuiField from './gui/gui-field'
import GuiInline from './gui/gui-inline'
import VSlider from '../VSlider/VSlider'
import { COLOR_LIST, COLOR_LIST_GRAY, WIDTH_MAP, WIDTH_MAP_CARD, COLOR_INDEX_CARD } from './utils/util'
import IconSelect from '@/components/IconSelect/IconSelect'

const normalGroupBase = {
  title: '指标标题',
  backgroundColor: '#4065e0',
  icon: 'ios-albums',
  iconSize: 24,
  value: 8888,
  field: ''
}
export default {
  name: 'Config',
  components: {
    IconSelect,
    GuiInline,
    GuiField,
    GuiGroup,
    GuiWrap,
    VSlider,
    Draggable
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    show() {
      return !!(this.data && isNotEmpty(this.data))
    },
    // 指标卡
    isIndexCard() {
      return this.data.type === 'index'
    },
    // 指标组
    isIndexGroup() {
      return this.data.type === 'indexGroup'
    },
    showGrid() {
      return this.data.options && this.data.options.grid
    },
    isLine() {
      return this.data.type === 'line'
    },
    isBar() {
      return this.data.type === 'bar'
    },
    isHistogram() {
      return this.data.type === 'histogram'
    },
    isPie() {
      return this.data.type === 'pie'
    },
    isRadar() {
      return this.data.type === 'radar'
    },
    isMap() {
      return this.data.type === 'map'
    },
    showXAxis() {
      let options = this.data.options
      return options.xAxis && (this.isLine || this.isHistogram || this.isBar)
    },
    showYAxis() {
      let options = this.data.options
      return options.yAxis && (this.isLine || this.isHistogram || this.isBar)
    }
  },
  data() {
    return {
      isDragging: false,
      tabs: [
        { key: 'tab1', title: '图表配置' },
        { key: 'tab2', title: '数据配置' }
      ],
      activeTab: 'tab1',
      activeConfig: '',
      widthMap: WIDTH_MAP,
      widthMap2: WIDTH_MAP_CARD,
      colors: COLOR_LIST,
      colorsGary: COLOR_LIST_GRAY,
      colorsIndex: COLOR_INDEX_CARD
    }
  },
  methods: {
    addIndex() {
      if (this.data.options.groupList.length === 5) {
        this.$message({ type: 'danger', content: '指标组内指标建议5个以内!' })
        return
      }
      this.data.options.groupList.push({ ...normalGroupBase })
      this.emitValue()
    },
    // 删除一项指标
    removeEnumItem(index) {
      if (this.data.options.groupList.length === 2) {
        this.$message({ type: 'danger', content: '指标组内指标需要保持至少2个!' })
        return
      }
      this.data.options.groupList.splice(index, 1)
      this.emitValue()
    },
    // 枚举拖拽结束
    onDragEnd(event) {
      this.isDragging = false
      let { oldIndex, newIndex } = event
      if (oldIndex !== newIndex) {
        this.emitValue()
      }
    },
    // 自适应按钮事件
    autoClick() {
      this.data.options.series.barWidth = 'auto'
      this.emitValue()
    },
    // 静态数据改变事件
    staticDataChange(val) {
      try {
        this.data.staticDataSource = JSON.parse(val)
        this.emitValue()
      } catch (e) {
      }
    },
    // 视觉映射类型改变
    visualMapChange(val) {
      if (val === 'piecewise') {
        this.data.options.visualMap.itemWidth = 10
        this.data.options.visualMap.itemHeight = 10
      } else {
        this.data.options.visualMap.itemWidth = 20
        this.data.options.visualMap.itemHeight = 100
      }
      this.emitValue()
    },
    // 设置sourceParam
    handleSetSourceParam(temp) {
      let { tempName, fields } = temp
      this.data.dataSourceName = tempName
      this.data.dataSourceParam = fields.map(item => {
        let temp = { ...item }
        delete temp['createDate']
        delete temp['updateDate']
        delete temp['orderNo']
        return {
          ...temp,
          realVal: {
            fieldName: '',
            value: null,
            type: 'val'
          }
        }
      })
      this.emitValue()
    },
    emitValue() {
      this.$emit('update-data')
    }
  }
}
</script>

<style lang="stylus" scoped>
.index-item {
  position: relative;
  border: 1px solid #eaeaea;
  margin: 0 5px 5px;
  padding-top: 5px;
  background-color: #fff;
  .move-drag {
    position absolute;
    display: none;
    top: -1px;
    left: 2px;
    cursor: grab;
    z-index: 10;
  }
  .remove-icon {
    position absolute;
    display: none;
    top: -1px;
    right: 2px;
    cursor: pointer;
    z-index: 10;
  }
  &.ghost {
    position: relative;
    font-size: 0;
    border: 1px dashed #ff4d4f;
    height: 50px;
    overflow: hidden;
    &::after {
      position: absolute;
      content: '';
      background: #e6f2ff;
      display: block;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
  &:hover {
    .move-drag, .remove-icon {
      display: block;
    }
  }
}
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}
</style>
