var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var mainLayer = new MainLayer();
        this.addChild(mainLayer);
        //var layer = new HelloWorldLayer();
        //this.addChild(layer);


    }
});
