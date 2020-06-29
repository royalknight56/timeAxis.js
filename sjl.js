
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
        window.timeJS.ftime=0;
        window.timeJS.ftime=0;
        var autotime = 0;
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
        function render(tpAll, autotime) {
            ///渲染
            //for (let i = 0; i < tpAll.length; i++) {
            let timearr = tpAll.getAttribute(TIME_ART).split("/");
            var j = 0;
            for (j = 0; j < timearr.length; j++) {
                if (autotime >= timearr[j] && autotime <= timearr[j + 1]) {
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

            if (autotime >= timefrom && autotime <= timeto) {
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
                        (autotime - timefrom) * (posto.split(",")[k] - posfrom.split(",")[k]) /
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

            } else if (autotime >= timeto) {
                //结束处理
                if (tpAll.getAttribute(TP_SAVE_ART) == "true") {

                    showElement(tpAll);
                } else if (tpAll.getAttribute(TP_SAVE_ART) == "auto") {
                    ///循环动画处理
                    let startTime = tpAll.getAttribute("f-start-time");
                    let startArray = startTime.split("/");
                    let distance = startArray[startArray.length - 1] - startArray[0];
                    let endTimeDistance = parseInt((autotime - startArray[0]) / distance) * distance;
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
            } else if (autotime <= timeto) {
                //返回处理
                if (tpAll.getAttribute(TP_SAVE_ART) == "true") {

                    hideElement(tpAll);

                } else if (tpAll.getAttribute(TP_SAVE_ART) == "auto") {
                    ///循环动画处理

                    let startTime = tpAll.getAttribute("f-start-time");


                    let startArray = startTime.split("/");

                    if (autotime < startArray[0]) {
                        hideElement(tpAll);
                        return;
                    }

                    let distance = startArray[startArray.length - 1] - startArray[0];

                    let endTimeDistance = parseInt((autotime - startArray[0]) / distance) * distance;
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
            ///配置
            var autoAll = document.getElementsByTagName(AUTO_TAG);
            callRender(autoAll, autospeed,1);
        }, 100)
        //渲染
        function callRender(autoAll, num, type) {
            ///配置
            //var autoAll = document.getElementsByTagName(TP_TAG);
            //时间轴
            if (window.timeJS.ifStop) {/////判断是否暂停
            } else {
                if (type == 0) {//非自动
                    window.timeJS.ftime = window.timeJS.ftime+num;
                } else if (type == 1) {//自动
                    autotime = autotime+num;
                }
                //渲染
                if (window.timeJS.ifFrozen) {///判断是否冻结
                } else {
                    for (let i = 0; i < autoAll.length; i++) {
                        render(autoAll[i], window.timeJS.ftime);
                    }
                }
            }
        }
        //Key事件
        window.addEventListener("keydown", function (e) {
            var autoAll = document.getElementsByTagName(TP_TAG);
            if (e.key == "ArrowDown" || e.key == "ArrowRight") {
                callRender(autoAll, speed,0);
            } else if (e.key == "ArrowUp" || e.key == "ArrowLeft") {
                callRender(autoAll, -speed,0);
            }
        })
        //Wheel事件
        window.onmousewheel = function (e) {
            var autoAll = document.getElementsByTagName(TP_TAG);
            callRender(autoAll, e.deltaY/Math.abs(e.deltaY)*speed,0);
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
    frozen() {
        window.timeJS.ifFrozen = true;
    }
    unFrozen() {
        window.timeJS.ifFrozen = false;
    }
    timeCtrl(num, fun) {
    }
}