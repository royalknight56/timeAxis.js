
(function() {
    console.log("%c[START]---------------时间轴JS--------------", "color: green");
    console.log("%c[START]-----------持续改进中-1.0------------", "color: green");
    console.log("%c[START]-------------------------------------", "color: green");

    const AUTO_TAG="autotp";
    const TIME_ART="f-time";
    const TP_TAG="tp";
    const TP_VALUE_ART="f-pos";
    const TP_SAVE_ART= "f-ifsave";
    const TP_BIND_ART="f-bind";
    
    var tpAuto = document.getElementsByTagName(AUTO_TAG);
     for (i = 0; i < tpAuto.length; i++) {
         tpAuto[i].setAttribute("f-start-time",tpAuto[i].getAttribute(TIME_ART))
         
    }
    render(tpAuto,0);

    var tpAuto = document.getElementsByTagName(TP_TAG);
    
     for (i = 0; i < tpAuto.length; i++) {
         tpAuto[i].setAttribute("f-start-time",tpAuto[i].getAttribute(TIME_ART))
         hideElement(tpAuto[i])
    }
    render(tpAuto,0);



    var ftime = 0;
    var autotime = 0;
    var autospeed = 1;
    var speed = 1;

    if (document.getElementsByClassName('tp-conf')[0]== null) {
        console.log("%c[ERROR]---tp-conf didn't exist-------", "color: red;background-color:white;font-size:15px");
    } else {
        if (document.getElementsByClassName('tp-conf')[0].getAttribute('autospeed') == null) {
            console.log("%c[WARN]---autospeed didn't initialization-------", "color: yellow;background-color:black;font-size:15px");
            console.log("%c[WARN]---autospeed is defult value:1-----------", "color: yellow;background-color:black;font-size:15px");
        } else {
            autospeed = document.getElementsByClassName('tp-conf')[0].getAttribute('autospeed');
        }
        if (document.getElementsByClassName('tp-conf')[0].getAttribute('speed') == null) {
            console.log("%c[WARN]---speed didn't initialization-------", "color: yellow;background-color:black;font-size:15px");
            console.log("%c[WARN]---speed is defult value:1-----------", "color: yellow;background-color:black;font-size:15px");
        } else {
            speed = document.getElementsByClassName('tp-conf')[0].getAttribute('speed');
        }
    }

    function hideElement(e){
        e.style.opacity = '0';
        e.style.display="none"
    }
    function showElement(e){
        e.style.display="block";
        e.style.opacity = '1';
    }
    //渲染core
    function render(tpAll,autotime){
        ///渲染
        for (i = 0; i < tpAll.length; i++) {
            let timearr = tpAll[i].getAttribute(TIME_ART).split("/");
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
                showElement(tpAll[i]);


                let posfrom = tpAll[i].getAttribute(TP_VALUE_ART).split('/')[j];
                let posto = tpAll[i].getAttribute(TP_VALUE_ART).split('/')[j + 1];

                let bindarr;
                if (tpAll[i].getAttribute(TP_BIND_ART) == null) {
                    bindarr = ["left,$px", "top,$px"]
                } else {
                    bindarr = tpAll[i].getAttribute(TP_BIND_ART).split('/');
                }
                var k = 0;
                for (k = 0; k < bindarr.length; k++) {
                    let filler = (parseInt(posfrom.split(",")[k]) +
                        (autotime - timefrom) * (posto.split(",")[k] - posfrom.split(",")[k]) /
                        (timeto - timefrom));
                    tpAll[i].style[bindarr[k].split(",")[0]] = bindarr[k].split(",")[1].replace("$", filler);

                }

            } else if (autotime >= timeto) {
                //结束处理
                if (tpAll[i].getAttribute(TP_SAVE_ART) == "true") {

                    showElement(tpAll[i]);
                    //tpAll[i].style.opacity = '1';
                } else if (tpAll[i].getAttribute(TP_SAVE_ART) == "auto") {
                    ///循环动画处理
                    let startTime=tpAll[i].getAttribute("f-start-time");
                    let startArray=startTime.split("/");
                    let distance=startArray[startArray.length-1]-startArray[0];
                    let endTimeDistance=parseInt((autotime-startArray[0])/distance)*distance;
                    let endTime="";
                    for(let i=0;i<startArray.length-1;i++){
                        endTime+=parseInt(parseInt(startArray[i])+parseInt(endTimeDistance));
                        endTime+="/";
                    }

                    endTime+=parseInt(parseInt(startArray[startArray.length-1])+parseInt(endTimeDistance));
                    tpAll[i].setAttribute(TIME_ART,endTime);

                } else {
                    hideElement(tpAll[i]);

                }
            } else if (autotime <= timeto) {
                //返回处理
                if (tpAll[i].getAttribute(TP_SAVE_ART) == "true") {

                    hideElement(tpAll[i]);
                    //tpAll[i].style.opacity = '1';
                } else if (tpAll[i].getAttribute(TP_SAVE_ART) == "auto") {
                    ///循环动画处理
                    
                    let startTime=tpAll[i].getAttribute("f-start-time");
                    

                    let startArray=startTime.split("/");

                    if(autotime<startArray[0]){
                        hideElement(tpAll[i]);
                        return;
                    }

                    let distance=startArray[startArray.length-1]-startArray[0];
                    
                    let endTimeDistance=parseInt((autotime-startArray[0])/distance)*distance;
                    let endTime="";
                    for(let i=0;i<startArray.length-1;i++){
                        endTime+=parseInt(parseInt(startArray[i])+parseInt(endTimeDistance));
                        endTime+="/";
                    }
                    endTime+=parseInt(parseInt(startArray[startArray.length-1])+parseInt(endTimeDistance));
                    tpAll[i].setAttribute(TIME_ART,endTime);

                } else {
                    hideElement(tpAll[i]);

                }
            } else {
                hideElement(tpAll[i]);

            }
        }
    }
    //Auto渲染
    window.setInterval(function () {
        
        ///配置
        var autoAll=document.getElementsByTagName(AUTO_TAG);

        ///时间轴
        autotime += 10;
        //渲染
        render(autoAll,autotime);
        
    }, 500 / autospeed)
    //Key渲染
    window.onkeydown = function (e) {

        ///配置
        var autoAll=document.getElementsByTagName(TP_TAG);

        
        //时间轴
        if (e.key == "ArrowDown" || e.key == "ArrowRight") {
            ftime += speed * 10;
        } else if (e.key == "ArrowUp" || e.key == "ArrowLeft") {
            ftime -= speed * 10;
        }

        //渲染
        render(autoAll,ftime);

    }

    //Wheel渲染
    window.onmousewheel = function (e) {

        ///配置
        var autoAll=document.getElementsByTagName(TP_TAG);

        //时间轴
        ftime += speed * e.deltaY / 10;
        //渲染
        render(autoAll,ftime);

    }

    window
})(document);
