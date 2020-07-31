/*
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-01 09:45:44
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-07-31 15:41:45
 */
var timeJS = require('./core')
var timeAxis={};
timeAxis.install=function(Vue){
    Vue.prototype.timeClass=new timeJS({
        speed: 1,
        autoSpeed: 1,
        delay: 0.1,
    });
    Vue.component('autotp', {
        data: function () {
          return {
            count: 0
          }
        },
        template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
      })
}
export default timeAxis;