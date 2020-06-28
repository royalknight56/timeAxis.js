# time.js
make html move


## 引入
通过src引入，放在文档末尾
```
<script src="sjl.js"></script>
```

## 使用

使用tp标签

此脚本会寻找所有tp和autotp标签，并使他们运动

```
<tp>
        tp指手动控制
</tp>

<autotp>
        autotp指此元素会自动播放
</autotp>

```

## 时间
控制动画，就需要关键帧，关键帧节点的时间是由f-time属性控制的
格式是
关键帧时间1(开始时间)/关键帧时间2/......关键帧时间n(结束时间)
```
<tp f-time="1000/1100/1400/2000">
    这个节点在1000时出现
    经过1100，1400，
    在2000时消失
</tp>
```
以上例子是指Email会在1000时显示，2000时消失

## 变化
只有关键帧而没有变化是无意义的
在f-value属性中，可以定义每个时间段的CSS属性值

格式是
变化值1(开始时间)/变化值2/......变化值n(结束时间)
```
<tp f-value="00,0/30,0/400,0/900,0"  f-time="1000/1100/1400/2000">
        Email
</tp>
```

## 属性绑定
我们可以将变化值通过f-bind绑定在其他属性上
f-bind中：使用/分隔每个CSS属性
使用,分隔每个属性的属性名和单位
比如 left,$px中，会使f-value中的每个关键帧的第一值绑定到left属性中 格式为$px,变化的值会自动填写在$中
```
<tp  
f-value="700,200/800,200/700,100/700,200" 
f-bind="left,$px/top,$px" 
f-time="1000/1100/1400/2000">
        这个节点在1000时出现，left值为700 px，top值为200 px;
        在1100时，left值为800 px，top值为200px；
</tp>
```
```
<tp 
f-value="1700,300,300/700,300,360/700,300,360"
f-bind="left,$px/top,$px/transform,rotate($deg)" 
f-time="600/700/1000">
        这个节点时间从600到1000
        变化的属性是left,top,transform，变化值的单位是px,px,rotate($deg)，
        即它会平行移动并且转动
</tp>
   ```
在上个例子中，我们绑定了transform,rotate($deg) 会使当前元素旋转

## 全局配置
请在html中加入以下id的元素（tp-conf），设置全局控制属性 可以控制speed（手动播放速度）或者autospeed（自动播放tpauto速度）
```
<div id="tp-conf" speed="6" autospeed="20"></div>
```
没有这个属性的话脚本会自动设置为1

## 控制
本脚本的帧主要通过[右键]，[下键]，[滑轮向下]来前向播放
通过[左键]，[上键]，[滑轮向上]来反向播放
tpauto的标签的元素会自动播放



## 动画循环
f-ifsave用来控制元素的保留，或者动画的循环
```
<tp  
f-ifsave="auto" 
f-value="1700,300,300/700,300,360/700,300,360"
f-bind="left,$px/top,$px/transform,rotate($deg)" 
f-time="600/700/1000" style="font-size: 30px;">
        这个元素会在时间之后一直循环
</tp>

<tp  
f-ifsave="true" 
f-value="1700,300,300/700,300,360/700,300,360"
f-bind="left,$px/top,$px/transform,rotate($deg)" 
f-time="600/700/1000" style="font-size: 30px;">
        这个元素会在时间之后固定
</tp>

```
共有三种值：false（默认值）
当前元素在时间之外会消失
true：当前元素在时间之后会保留
auto：当前元素会永远循环播放

## 未来

为什么使用html来控制动画
我考虑到可以通过html的简单属性就可以完成大部分动画效果
因此，未来有可能通过一些工具就可以可视化的设置动画，让动画效果广泛的应用在html中
即时你不熟悉Js，也能做出有设计感的动态页面

## 实例Demo
苹果官网的手机介绍界面一直是我模仿的方向

[apple](http://superboom.club/apple/)


一份简单的个人简历

[timejs-myInfo](http://superboom.club/timejs-myinfo/)