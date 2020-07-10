/*
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-01 09:45:44
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-07-10 18:11:52
 */
function log(code) {
    switch (code) {
        case 101:
            console.log("%c[START]---------------时间轴JS--------------", "color: green");
            console.log("%c[START]-------------------------------------", "color: green");
            break;
        case 201:
            console.log("%c[ERROR]---tp-conf didn't exist-------", "color: red;background-color:white;font-size:15px");
            break;
        case 202:
            console.log("%c[WARN]---autoSpeed didn't initialization-------", "color: yellow;background-color:black;font-size:15px");
            console.log("%c[WARN]---autoSpeed is defult value:1-----------", "color: yellow;background-color:black;font-size:15px");
            break;
        case 203:
            console.log("%c[WARN]---speed didn't initialization-------", "color: yellow;background-color:black;font-size:15px");
            console.log("%c[WARN]---speed is defult value:1-----------", "color: yellow;background-color:black;font-size:15px");
            break;
        case 204:
            console.log("%c[WARN]---no f-value-------", "color: yellow;background-color:black;font-size:15px")
            break;
        case 205:
            console.log("%c[WARN]---no f-time-------", "color: yellow;background-color:black;font-size:15px")
            break;
        case 206:
            console.log("%c[WARN]---no f-value-------", "color: yellow;background-color:black;font-size:15px")
            break;
        case 207:
            console.log("%c[WARN]---one element's bind didn't initialization-------", "color: yellow;background-color:black;font-size:15px");
            break;
    }
}
class timeJS {

    constructor(opt) {
        log(101);
        this.AUTO_TAG = "autotp";
        this.TP_TAG = "tp";

        this.TP_TIME_ART = "f-time";
        this.TP_VALUE_ART = "f-value";
        this.TP_SAVE_ART = "f-ifsave";
        this.TP_BIND_ART = "f-bind";
        this.TP_BIND_OPT_ART = "f-opt";


        this._manTime = 0;
        this._autoTime = 0;

        this.ifStop = false;

        this.timeCtrl = [];
        this.autoTimeCtrl = [];
        this.speed = 1;
        this.autoSpeed = 1;
        this.birth = 0;
        this.death = Number.MAX_VALUE;


        //进行初始化，隐藏所有元素，并记录f-start-time属性
        
        var moveMan = document.getElementsByTagName(this.AUTO_TAG);
        for (let i = 0; i < moveMan.length; i++) {
            moveMan[i].setAttribute("f-start-time", moveMan[i].getAttribute(this.TP_TIME_ART))
            this.hideElement(moveMan[i])
            this.render(moveMan[i], 0);
        }
        var moveAuto = document.getElementsByTagName(this.TP_TAG);
        for (let i = 0; i < moveAuto.length; i++) {
            moveAuto[i].setAttribute("f-start-time", moveAuto[i].getAttribute(this.TP_TIME_ART))
            this.hideElement(moveAuto[i]);
            this.render(moveAuto[i], 0);
        }

        //document.styleSheets[0].addRule('tp', 'transition: visibility 0s');
        //document.styleSheets[0].addRule('autotp', 'transition: visibility 0s');
        /**
         * @description: 检查配置
         * @author: RoyalKnight
         */
        if (opt == null) {
            log(201)
        } else {
            if (opt.autoSpeed == null) {//检查自动播放速度
                log(202)
            } else {
                this.autoSpeed = opt.autoSpeed;
            }
            if (opt.speed == null) {//检查手动播放速度
                log(203)
            } else {
                this.speed = opt.speed;
            }
            if (opt.birth) {//初始化开始时间
                this.birth = opt.birth;
            } else {
            }
            if (opt.death) {//初始化结束时间
                this.death = opt.death;
            } else {
            }
        }
        /**
         * @description: 添加动作执行触发事件
         * @author: RoyalKnight
         */
        var $this = this
        //Auto渲染
        window.setInterval(function () {
            $this.callRender($this.autoSpeed, 1);
        }, 100)
        //Key事件
        window.addEventListener("keydown", function (e) {
            if (e.key == "ArrowDown" || e.key == "ArrowRight") {
                $this.callRender($this.speed, 0);
            } else if (e.key == "ArrowUp" || e.key == "ArrowLeft") {
                $this.callRender(-$this.speed, 0);
            }
        })
        //Wheel事件
        window.addEventListener("mousewheel", function (e) {
            $this.callRender(e.deltaY / Math.abs(e.deltaY) * $this.speed, 0);
        })
    }
    //隐藏元素
    hideElement(e) {
        //e.style.opacity = '0';
        //e.style.display = "none"
        e.style.visibility="hidden"
    }
    //显示元素
    showElement(e) {
        //e.style.opacity = '1';
        //e.style.display = "";
        e.style.visibility="visible"
    }
    callRender(num, type) {
        //时间轴
        if (this.ifStop) {/////判断是否暂停

        } else {
            if (type == 0) {//非自动
                this.manTime = this.manTime + num;
            } else if (type == 1) {//自动
                if (this.autoTime < this.death && this.autoTime >= this.birth) {
                    this.autoTime = this.autoTime + num;
                }
            }
        }
    }
    ifTimeCtrlExist(fun){
        if (fun != undefined) {
            fun.fun();
            if (fun.ifonce) {
                fun = undefined;
            }
        }
    }
    /**
     * @description: 对内部时间控制变量的代理
     * @author: RoyalKnight
     */

    get manTime() {
        return this._manTime;
    }
    set manTime(value) {
        let i = this._manTime;
        if (this._manTime > value) {
            for (i--; i >= value; i--) {
                this.ifTimeCtrlExist(this.timeCtrl[i])
            }
        } else if (this._manTime < value) {
            for (i++; i <= value; i++) {
                this.ifTimeCtrlExist(this.timeCtrl[i])
            }
        }//正反顺序寻找是否绑定时间控制函数，进行执行
        this._manTime = value;
        let manAll = document.getElementsByTagName(this.TP_TAG);
        for (let i = 0; i < manAll.length; i++) {
            this.render(manAll[i], value);
        }
    }
    get autoTime() {
        return this._autoTime;
    }
    set autoTime(value) {
        let i = this._autoTime;
        if (this._autoTime > value) {
            for (i--; i >= value; i--) {
                this.ifTimeCtrlExist(this.autoTimeCtrl[i])
            }
        } else if (this._autoTime < value) {
            for (i++; i <= value; i++) {
                this.ifTimeCtrlExist(this.autoTimeCtrl[i])
            }
        }//正反顺序寻找是否绑定时间控制函数，进行执行
        this._autoTime = value;
        let autoAll = document.getElementsByTagName(this.AUTO_TAG);
        for (let i = 0; i < autoAll.length; i++) {
            this.render(autoAll[i], value);
        }

    }

    //渲染core
    render(moveElement, autoTime) {
        /**
         * @description: 渲染时对元素的配置的判断
         * @author: RoyalKnight
         */
        let timeArt = moveElement.getAttribute(this.TP_TIME_ART);
        if (timeArt) {//有time属性
            let valueArt = moveElement.getAttribute(this.TP_VALUE_ART);
            if (valueArt) {

            } else {
                log(204)
                return
            }
        } else {//无time属性
            log(205)
            let valueArt = moveElement.getAttribute(this.TP_VALUE_ART);
            if (valueArt) {//无time属性有value属性
                //管道
                if (moveElement.getAttribute(this.TP_BIND_OPT_ART) != null) {
                    let funArry = moveElement.getAttribute(this.TP_BIND_OPT_ART).split("/");
                    let ifmark = 0;
                    for (let i = 0; i < funArry.length; i++) {
                        let values = moveElement.getAttribute(this.TP_VALUE_ART).split('/');
                        for (let j = 0; j < values.length; j++) {
                            if (this[funArry[i]]) {
                                this[funArry[i]](values[j])
                                ifmark = 1;
                            } else {

                            }
                        }
                    }
                    if (ifmark == 1) {
                        moveElement.parentNode.removeChild(moveElement)
                    }
                    this.hideElement(moveElement)
                    //moveElement.parentNode.removeChild(moveElement)
                }
            } else {
                log(206)
                return
            }
            return
        }

        /**
         * @description: 进行计算
         * @author: RoyalKnight
         */
        let timearr = timeArt.split("/");
        var j = 0;
        for (j = 0; j < timearr.length; j++) {
            if (autoTime >= timearr[j] && autoTime <= timearr[j + 1]) {
                break;
            }
        }
        let timefrom;
        let timeto;
        if (j == timearr.length) {
            timefrom = timearr[j - 1];
            timeto = timearr[j - 1];
        } else {
            timefrom = timearr[j];
            timeto = timearr[j + 1];
        }
        if (autoTime >= timefrom && autoTime <= timeto) {
            //显示时渲染
            this.showElement(moveElement);
            let posfrom = moveElement.getAttribute(this.TP_VALUE_ART).split('/')[j];
            let posto = moveElement.getAttribute(this.TP_VALUE_ART).split('/')[j + 1];
            let bindarr;
            if (moveElement.getAttribute(this.TP_BIND_ART) == null) {
                log(207)//没有设置绑定的CSS属性，将计算值全部应用到管道中
                let filler = (parseFloat(posfrom) +
                    (autoTime - timefrom) * (posto - posfrom) /
                    (timeto - timefrom));
                //filler为计算出的值
                //管道
                if (moveElement.getAttribute(this.TP_BIND_OPT_ART) != null) {
                    let funArry = moveElement.getAttribute(this.TP_BIND_OPT_ART).split("/");
                    for (let i = 0; i < funArry.length; i++) {
                        filler = this[funArry[i]]?.(filler);
                    }
                }
            } else {
                bindarr = moveElement.getAttribute(this.TP_BIND_ART).split('/');
                var k = 0;
                for (k = 0; k < bindarr.length; k++) {
                    let filler = (parseFloat(posfrom.split(",")[k]) +
                        (autoTime - timefrom) * (posto.split(",")[k] - posfrom.split(",")[k]) /
                        (timeto - timefrom));
                    //filler为计算出的值
                    //管道
                    if (moveElement.getAttribute(this.TP_BIND_OPT_ART) != null) {
                        let funArry = moveElement.getAttribute(this.TP_BIND_OPT_ART).split("/");
                        for (let i = 0; i < funArry.length; i++) {
                            filler = this[funArry[i]]?.(filler);
                        }
                    }
                    let bindArt = bindarr[k].split(",")[0];
                    let bindVal = bindarr[k].split(",")[1];
                    if (bindVal[bindVal.length - 1] == ";") {
                        bindVal = bindVal.slice(0, bindVal.length - 1)
                    }//处理bind最后字符为“;”
                    moveElement.style[bindArt] = bindVal.replace("$", filler);//将$替换为值

                }
            }


        } else if (autoTime > timeto) {
            //结束处理
            if (moveElement.getAttribute(this.TP_SAVE_ART) == "true") {

                this.showElement(moveElement);
            } else if (moveElement.getAttribute(this.TP_SAVE_ART) == "auto") {
                ///循环动画处理
                let startTime = moveElement.getAttribute("f-start-time");
                let startArray = startTime.split("/");
                let distance = startArray[startArray.length - 1] - startArray[0];
                let endTimeDistance = parseInt((autoTime - startArray[0]) / distance) * distance;
                let endTime = "";
                for (let i = 0; i < startArray.length - 1; i++) {
                    endTime += parseInt(parseInt(startArray[i]) + parseInt(endTimeDistance));
                    endTime += "/";
                }
                endTime += parseInt(parseInt(startArray[startArray.length - 1]) + parseInt(endTimeDistance));
                moveElement.setAttribute(this.TP_TIME_ART, endTime);
            } else {
                this.hideElement(moveElement);
            }
        } else if (autoTime <= timeto) {
            //返回处理
            if (moveElement.getAttribute(this.TP_SAVE_ART) == "true") {
                this.hideElement(moveElement);
            } else if (moveElement.getAttribute(this.TP_SAVE_ART) == "auto") {
                ///循环动画处理
                let startTime = moveElement.getAttribute("f-start-time");
                let startArray = startTime.split("/");
                if (autoTime < startArray[0]) {
                    this.hideElement(moveElement);
                    return;
                }
                let distance = startArray[startArray.length - 1] - startArray[0];
                let endTimeDistance = parseInt((autoTime - startArray[0]) / distance) * distance;
                let endTime = "";
                for (let i = 0; i < startArray.length - 1; i++) {
                    endTime += parseInt(parseInt(startArray[i]) + parseInt(endTimeDistance));
                    endTime += "/";
                }
                endTime += parseInt(parseInt(startArray[startArray.length - 1]) + parseInt(endTimeDistance));
                moveElement.setAttribute(this.TP_TIME_ART, endTime);
            } else {
                this.hideElement(moveElement);
            }
        } else {
            this.hideElement(moveElement);
        }
    }
    /**
     * @description: 绑定管道
     * @param {Object} {"funName":function(){}}
     * @return {NULL}
     * @author: RoyalKnight
     */
    bind(opt) {
        for (let key in opt) {
            if (key == "bind") {
            } else {
                this[key] = opt[key];
            }
        }
    }
    /**
     * @description: 停止播放
     * @param {NULL} 
     * @return {NULL} 
     * @author: RoyalKnight
     */
    stop() {
        this.ifStop = true;
    }
    /**
     * @description: 开始播放
     * @param {NULL} 
     * @return {NULL} 
     * @author: RoyalKnight
     */
    start() {
        this.ifStop = false;
    }

    bindCtrl(num, fun, ifonce) {
        for (let i = 0; i < num.length; i++) {
            this.timeCtrl[num[i]] = { fun, ifonce };
        }
    }
    bindAutoCtrl(num, fun, ifonce) {
        for (let i = 0; i < num.length; i++) {
            this.autoTimeCtrl[num[i]] = { fun, ifonce };
        }
    }
    setTime(num) {
        this.manTime = num;
    }
    getTime() {
        return this.manTime;
    }
    setAutoTime(num) {
        this.autoTime = num;
    }
    getAutoTime() {
        return this.autoTime;
    }
}