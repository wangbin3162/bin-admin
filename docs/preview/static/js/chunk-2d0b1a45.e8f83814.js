(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0b1a45"],{"215e":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("page-header-wrap",[a("v-table-wrap",[a("b-alert",[t._v("图表组件bin-charts现已独立为插件，依赖echarts\n      "),a("template",{slot:"desc"},[t._v("\n        具体请查看"),a("a",{attrs:{href:"https://wangbin3162.gitee.io/bin-charts",target:"_blank"}},[t._v("示例文档")]),t._v("来获取更多插件使用方法\n      ")])],2),a("div",{staticStyle:{width:"100%",height:"425px",border:"1px solid #ddd",margin:"20px 0"}},[a("b-split",{attrs:{"default-percent":50}},[a("div",{staticClass:"left-container",attrs:{slot:"left"},slot:"left"},[a("div",{staticStyle:{width:"100%",height:"100%","padding-top":"15px",position:"relative"},attrs:{id:"chart1"}},[a("b-charts",{attrs:{height:"350px",options:t.lineChartOption}})],1)]),a("div",{staticClass:"right-container",attrs:{slot:"right"},slot:"right"},[t._v("\n          数据源:\n          "),a("b-code-editor",{on:{"on-change":t.dataSourceChange},model:{value:t.dataSource,callback:function(e){t.dataSource=e},expression:"dataSource"}})],1)])],1)],1)],1)},i=[],o=a("c1fc"),l={name:"ChartDemo",data:function(){return{lineChartOption:{tooltip:{trigger:"axis"},title:{text:"默认折线图"},grid:{top:80,right:30},xAxis:{type:"category",boundaryGap:!1},yAxis:{type:"value"},series:[{type:"line",name:"数量",areaStyle:{opacity:.4},itemStyle:{color:"#c7c7ff"},showSymbol:!1}],dataset:Object(o["b"])({xField:"month",yField:"value"},[])},dataSource:JSON.stringify([{month:"1月",value:220},{month:"2月",value:315},{month:"3月",value:434},{month:"4月",value:386},{month:"5月",value:409},{month:"6月",value:378},{month:"7月",value:533},{month:"8月",value:820},{month:"9月",value:1290},{month:"10月",value:1330},{month:"11月",value:901},{month:"12月",value:1290}],null,2)}},created:function(){var t=JSON.parse(this.dataSource);this.lineChartOption.dataset=Object(o["b"])({xField:"month",yField:"value"},t)},methods:{dataSourceChange:function(t){try{var e=JSON.parse(t);this.lineChartOption.dataset=Object(o["b"])({xField:"month",yField:"value"},e)}catch(a){}}}},r=l,s=a("2877"),h=Object(s["a"])(r,n,i,!1,null,null,null);e["default"]=h.exports}}]);