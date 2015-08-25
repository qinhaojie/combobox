# combobox
js模拟下拉框

使用
-----

只需在jquery后引入jquery.validation文件

``` html
<script src='jquery.js'></script>
<script src='jquery.validation.js'></script>
```

初始化
---------------
选择元素调用combobox方法传入配置项
``` javascript
$('select').combobox(options);
```

方法
-----------
* 调用方式

``` javascript
//选择元素调用combobox方法 第一个参数为调用的方法名，第二个为该方法所需参数
//eg : 改变下拉框选项内容
$('select').combobox('setItem', [{value:1,text:1},{value:2,text:2}]);

```
* 可调用方法

**setItem**  改变下拉框选项内容  
``` javascript
$('select').combobox('setItem', [{value:1,text:1},{value:2,text:2}]);
```  
**show** 展开下拉框

**hide** 关闭下拉框

**toggle** 切换展开关闭状态

**disable** 是否禁用下拉框



