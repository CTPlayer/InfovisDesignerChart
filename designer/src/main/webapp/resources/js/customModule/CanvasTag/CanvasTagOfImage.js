define(['jquery', 'zrender', 'zrender/shape/Image'], function($, zrender, imageShape){
    return function(){
        var zr = {};
        return {
            render: function(id, imgSrc, option, isCenter){
                var  target = $("#"+id);
                zr = zrender.init(target[0]);
                //绑定zrenderid
                target.attr("zid",zr.getId());
                var pageY = zr.getHeight();
                var pageX = zr.getWidth();
                if(!option){
                    zr.addShape(
                        new imageShape({
                            style: {
                                image: imgSrc,
                                x: pageX / 8,
                                y: pageY / 8,
                                text: '请输入文字',
                                textPosition: 'inside',
                                textFont: "bold " + pageX / 8 + "px verdana",
                                width: pageX - (pageX / 4),
                                height: pageY - (pageY / 4),
                                textColor: 'black'
                            },
                            draggable : false,
                            hoverable: false
                        })
                    );
                }else {
                    option.x = pageX / 8;
                    option.y = pageY / 8;
                    // option.width = pageX;
                    if(isCenter == false){
                        option.x = 0;
                        option.y = 0;
                    }
                    zr.addShape(
                        new imageShape({
                            style: option,
                            draggable : false,
                            hoverable: false
                        })
                    );
                }
                zr.render();
                return this;
            },
            getOption: function(){
                if(zr){
                    return zr.storage.getShapeList()[0].style;
                }
            }
        }
    }
});