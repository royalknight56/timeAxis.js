
(function() {
    console.log("%c[START]---------------时间轴JS--------------", "color: green");
    console.log("%c[START]-----------持续改进中-1.0------------", "color: green");
    console.log("%c[START]-------------------------------------", "color: green");

    var tpAll = document.getElementsByClassName('tp');
    let i = 0;
    for (i = 0; i < tpAll.length; i++) {
        tpAll[i].style.position = "absolute";
        tpAll[i].style.opacity = '0';
    }

    tpAll = document.getElementsByClassName('tpauto');

    for (i = 0; i < tpAll.length; i++) {
        tpAll[i].style.position = "absolute";
        tpAll[i].style.opacity = '0';
    }





    var ftime = 0;
    var autotime = 0;
    var autospeed = 1;
    var speed = 1;

    if (document.getElementsByClassName('tp-conf')[0]== null) {
        console.log("%c[ERROR]---tp-conf didn't exist-------", "color: red;background-color:white;font-size:15px");
    } else {
        if (document.getElementsByClassName('tp-conf')[0].getAttribute('autospeed') == null) {
            console.log("%c[ERROR]---autospeed didn't initialization-------", "color: red;background-color:black;font-size:15px");
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

    function tr(e){
        console.log("end");
        e.style.display="none"
        e.removeEventListener("transitionend",tr);
    }
    function hideElement(e){
        e.style.opacity = '0';
        //e.addEventListener("transitionend",tr(e))
        
        var pr=new Promise((resolve,reject)=>{
            if(e.style.opacity=='0'){
                resolve(1);
            }
        }).then(
            e.style.display="none"
        )
        
    }
    function showElement(e){
        e.style.display="block";
        //e.style.opacity = '1';
        /*
        e.addEventListener("transitionend",function sh(){
            console.log("star");
            //e.style.display="none"
            e.removeEventListener("transitionend",tr);
        })
        */
        var pr=new Promise((resolve,reject)=>{
            if(e.style.display=='block'){
                resolve(1);
            }
        }).then(
            e.style.opacity="1"
        )
        
    }
    //渲染core
    function render(tpAll,autotime){
        ///渲染
        for (i = 0; i < tpAll.length; i++) {
            let timearr = tpAll[i].getAttribute('f-time').split("/");
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
                //tpAll[i].style.opacity = '1';

                let posfrom = tpAll[i].getAttribute('f-pos').split('/')[j];
                let posto = tpAll[i].getAttribute('f-pos').split('/')[j + 1];

                let bindarr;
                if (tpAll[i].getAttribute('f-bind') == null) {
                    bindarr = ["left,$px", "top,$px"]
                } else {
                    bindarr = tpAll[i].getAttribute('f-bind').split('/');
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
                if (tpAll[i].getAttribute('f-ifsave') == "true") {

                    showElement(tpAll[i]);
                    //tpAll[i].style.opacity = '1';
                } else if (tpAll[i].getAttribute('f-ifsave') == "auto") {
                    ///循环动画处理
                    let tottar=tpAll[i].getAttribute('f-time');
                    let tar = tottar.split("/");
                    var re = "/";
                    for (let ii = 0; ii < tar.length; ii++) {
                        re += parseInt(tar[ii]) + parseInt(tar[tar.length - 1]) - parseInt(tar[0]);
                        if (ii == tar.length - 1) {

                        } else {
                            re += "/";
                        }
                    }

                    tpAll[i].setAttribute('f-time', tottar+re);
                    tpAll[i].setAttribute('f-pos',  tpAll[i].getAttribute('f-pos')+"/"+tpAll[i].getAttribute('f-pos'));

                } else {
                    hideElement(tpAll[i]);
                    //tpAll[i].style.opacity = '0';
                }
            } else {
                hideElement(tpAll[i]);
                //tpAll[i].style.opacity = '0';
            }
        }
    }
    //Auto渲染
    window.setInterval(function () {
        autotime += 10;

        var tpAll = document.getElementsByClassName('tpauto');
        let i = 0;

        //渲染
        render(tpAll,autotime);
        
    }, 500 / autospeed)
    //Key渲染
    window.onkeydown = function (e) {

        ///配置
        var tpAll = document.getElementsByClassName('tp');
        let i = 0;
        
        //时间轴
        if (e.key == "ArrowDown" || e.key == "ArrowRight") {
            ftime += speed * 10;
        } else if (e.key == "ArrowUp" || e.key == "ArrowLeft") {
            ftime -= speed * 10;
        }

        //渲染
        render(tpAll,ftime);

    }

    //Wheel渲染
    window.onmousewheel = function (e) {

        ///配置
        var tpAll = document.getElementsByClassName('tp');
        let i = 0;

        //时间轴
        ftime += speed * e.deltaY / 10;
        //渲染
        render(tpAll,ftime);

    }
})(document);
