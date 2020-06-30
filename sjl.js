
class timeJS {

    constructor(opt) {

        window.timeJS = {};
        console.log("%c[START]---------------时间轴JS--------------", "color: green");
        console.log("%c[START]-----------持续改进中-1.0------------", "color: green");
        console.log("%c[START]-------------------------------------", "color: green");

        const AUTO_TAG = "autotp";
        const TIME_ART = "f-time";
        const TP_TAG = "tp";
        const TP_VALUE_ART = "f-value";
        const TP_SAVE_ART = "f-ifsave";
        const TP_BIND_ART = "f-bind";
        const TP_BIND_OPT_ART = "f-opt";

        var tpAuto = document.getElementsByTagName(AUTO_TAG);
        for (let i = 0; i < tpAuto.length; i++) {
            tpAuto[i].setAttribute("f-start-time", tpAuto[i].getAttribute(TIME_ART))
            render(tpAuto[i], 0);
        }


        var tpAuto = document.getElementsByTagName(TP_TAG);

        for (let i = 0; i < tpAuto.length; i++) {
            tpAuto[i].setAttribute("f-start-time", tpAuto[i].getAttribute(TIME_ART))
            hideElement(tpAuto[i]);
            render(tpAuto[i], 0);
        }
        window.timeJS.manTime = 0;
        window.timeJS = new Proxy({ manTime: 0,autoTime:0,ifStop:false,timeCtrl:[]}, {
            get: function (target, key, receiver) {
                return Reflect.get(target, key, receiver)
            },
            set: function (target, propKey, value, receiver) {
                if (propKey == "manTime") {
                    if(target[propKey]>value){
                        for(let i=target[propKey];i>value;i--){
                            if(window.timeJS.timeCtrl[i]!=undefined){
                                window.timeJS.timeCtrl[i].fun();
                                if(window.timeJS.timeCtrl[i].ifonce){
                                    window.timeJS.timeCtrl[i]=undefined;
                                }
                            }
                        }
                    }else{
                        for(let i=target[propKey];i<value;i++){
                            if(window.timeJS.timeCtrl[i]!=undefined){
                                window.timeJS.timeCtrl[i].fun();
                                if(window.timeJS.timeCtrl[i].ifonce){
                                    window.timeJS.timeCtrl[i]=undefined;
                                }
                            }
                        }
                    }
                    
                }
                
                if (propKey == "manTime") {
                    let manAll = document.getElementsByTagName(TP_TAG);
                    for (let i = 0; i < manAll.length; i++) {
                        render(manAll[i], value);
                    }
                }else if(propKey=='autoTime'){
                    let autoAll = document.getElementsByTagName(AUTO_TAG);
                    for (let i = 0; i < autoAll.length; i++) {
                        render(autoAll[i], value);
                    }
                }
                return Reflect.set(target, propKey, value, receiver);
            }
        })

        
        var autospeed = 1;
        var speed = 1;

        if (opt == null) {
            console.log("%c[ERROR]---tp-conf didn't exist-------", "color: red;background-color:white;font-size:15px");
        } else {
            if (opt.autoSpeed == null) {
                console.log("%c[WARN]---autospeed didn't initialization-------", "color: yellow;background-color:black;font-size:15px");
                console.log("%c[WARN]---autospeed is defult value:1-----------", "color: yellow;background-color:black;font-size:15px");
            } else {
                autospeed = opt.autoSpeed;
            }
            if (opt.speed == null) {
                console.log("%c[WARN]---speed didn't initialization-------", "color: yellow;background-color:black;font-size:15px");
                console.log("%c[WARN]---speed is defult value:1-----------", "color: yellow;background-color:black;font-size:15px");
            } else {
                speed = opt.speed;
            }
        }
        function hideElement(e) {
            e.style.opacity = '0';
            e.style.display = "none"
        }
        function showElement(e) {
            e.style.display = "block";
            e.style.opacity = '1';
        }
        //渲染core
        function render(tpAll, autoTime) {
            ///渲染
            //for (let i = 0; i < tpAll.length; i++) {
            let timearr = tpAll.getAttribute(TIME_ART).split("/");
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
                showElement(tpAll);


                let posfrom = tpAll.getAttribute(TP_VALUE_ART).split('/')[j];
                let posto = tpAll.getAttribute(TP_VALUE_ART).split('/')[j + 1];

                let bindarr;
                if (tpAll.getAttribute(TP_BIND_ART) == null) {
                    //bindarr = ["left,$px", "top,$px"]
                    console.log("%c[WARN]---one element's bind didn't initialization-------", "color: yellow;background-color:black;font-size:15px");

                } else {
                    bindarr = tpAll.getAttribute(TP_BIND_ART).split('/');
                }
                var k = 0;
                for (k = 0; k < bindarr.length; k++) {

                    let filler = (parseInt(posfrom.split(",")[k]) +
                        (autoTime - timefrom) * (posto.split(",")[k] - posfrom.split(",")[k]) /
                        (timeto - timefrom));
                    //filler为计算出的值

                    //管道
                    if (tpAll.getAttribute(TP_BIND_OPT_ART) != null) {
                        let funArry = tpAll.getAttribute(TP_BIND_OPT_ART).split("/");

                        for (let i = 0; i < funArry.length; i++) {
                            filler = window.timeJS[funArry[i]]?.(filler);
                        }
                    }

                    tpAll.style[bindarr[k].split(",")[0]] = bindarr[k].split(",")[1].replace("$", filler);//将$替换为值

                }

            } else if (autoTime >= timeto) {
                //结束处理
                if (tpAll.getAttribute(TP_SAVE_ART) == "true") {

                    showElement(tpAll);
                } else if (tpAll.getAttribute(TP_SAVE_ART) == "auto") {
                    ///循环动画处理
                    let startTime = tpAll.getAttribute("f-start-time");
                    let startArray = startTime.split("/");
                    let distance = startArray[startArray.length - 1] - startArray[0];
                    let endTimeDistance = parseInt((autoTime - startArray[0]) / distance) * distance;
                    let endTime = "";
                    for (let i = 0; i < startArray.length - 1; i++) {
                        endTime += parseInt(parseInt(startArray[i]) + parseInt(endTimeDistance));
                        endTime += "/";
                    }

                    endTime += parseInt(parseInt(startArray[startArray.length - 1]) + parseInt(endTimeDistance));
                    tpAll.setAttribute(TIME_ART, endTime);

                } else {
                    hideElement(tpAll);

                }
            } else if (autoTime <= timeto) {
                //返回处理
                if (tpAll.getAttribute(TP_SAVE_ART) == "true") {

                    hideElement(tpAll);

                } else if (tpAll.getAttribute(TP_SAVE_ART) == "auto") {
                    ///循环动画处理

                    let startTime = tpAll.getAttribute("f-start-time");


                    let startArray = startTime.split("/");

                    if (autoTime < startArray[0]) {
                        hideElement(tpAll);
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
                    tpAll.setAttribute(TIME_ART, endTime);

                } else {
                    hideElement(tpAll);

                }
            } else {
                hideElement(tpAll);

            }
            //}
        }

        function timeAdd(time, num) {
            return time + num;
        }

        //Auto渲染
        window.setInterval(function () {
            callRender(autospeed, 1);
        }, 100)
        //渲染
        function callRender(num, type) {
            //时间轴
            if (window.timeJS.ifStop) {/////判断是否暂停

            } else {
                if (type == 0) {//非自动
                    window.timeJS.manTime = window.timeJS.manTime + num;
                } else if (type == 1) {//自动
                    window.timeJS.autoTime = window.timeJS.autoTime + num;
                }
            }
        }
        //Key事件
        window.addEventListener("keydown", function (e) {

            if (e.key == "ArrowDown" || e.key == "ArrowRight") {
                callRender( speed, 0);
            } else if (e.key == "ArrowUp" || e.key == "ArrowLeft") {
                callRender(-speed, 0);
            }
        })
        //Wheel事件
        window.onmousewheel = function (e) {
            callRender(e.deltaY / Math.abs(e.deltaY) * speed, 0);
        }
    }
    bind(opt) {
        for (let key in opt) {
            if (key == "bind") {
            } else {
                window.timeJS[key] = opt[key];
            }
        }
    }
    stop() {
        window.timeJS.ifStop = true;
    }
    start() {
        window.timeJS.ifStop = false;
    }
    bindCtrl(num, fun,ifonce) {
        window.timeJS.timeCtrl[num]={fun,ifonce};
    }
    setTime(num){
        window.timeJS.manTime=num;
    }
}