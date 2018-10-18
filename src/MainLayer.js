var GRABABLE_MASK_BIT = 1 << 31;
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;

var MainLayer = cc.LayerColor.extend({
    sprite:null,
    enemy: null,
    moveLeft: false,
    enemyMoveLeft: true,
    _space: null,
    _debugNode: null,
    ctor:function () {
        this._super();
        this._space = new cp.Space();
        this._space.gravity = cp.v(0, 0);
        this.scheduleUpdate();
        var size = cc.winSize;
       // this.enemy = new cc.Sprite(res.Enemy_png);
        this.setColor(new cc.Color(200,200,200));

        this.sprite = new cc.Sprite(res.Player_png)
        this.sprite.x = size.width / 2;
        this.sprite.y = 20;

        this.addChild(this.sprite, 0);

        this._space.addCollisionHandler(1, 2,
            this.collisionBegin.bind(this),
            this.collisionPre.bind(this),
            this.collisionPost.bind(this),
            this.collisionSeparate.bind(this)
        );

        this.createEnemy();

        var that = this
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (key, event) {

                switch (key) {
                    case 32:

                       // var bullet = new cc.Sprite(res.Bullet_png);
                        let bullet = new cc.PhysicsSprite(res.Bullet_png);

                        that.addChild(bullet);

                        var body = new cp.Body(1, cp.momentForBox(Infinity, 16,16));
                        bullet.setBody(body);

                        var shape = new cp.BoxShape(body, 16, 16);
                        shape.setCollisionType(1);
                        shape.setFriction(1);
                        shape.setElasticity(0);
                        shape.setLayers(NOT_GRABABLE_MASK);
                        that._space.addBody(body);
                        that._space.addShape(shape);

                        bullet.x = that.sprite.x
                        bullet.y = that.sprite.y;

                        var travelUp = new cc.MoveBy(2, cc.p(0,800));

                        bullet.runAction(travelUp);

                        // shoot

                        break;
                    case 37:

                        that.moveLeft = true;
                       // var moveTo = new cc.MoveBy(0.1, cc.p(-4,0));
                        //that.sprite.runAction(moveTo);
                        //cc.log('left!');
                        break;
                    case 39:
                        that.moveLeft = false;
                        //var moveTo = new cc.MoveBy(0.1, cc.p(4,0));
                      //  that.sprite.runAction(moveTo);
                        //cc.log('right');
                        break;
                }
            }
        }, this);





        return true;
    },
    createEnemy: function() {
        var size = cc.winSize;
        this.enemy = new cc.PhysicsSprite(res.Enemy_png);
        var body = this._space.addBody(new cp.Body(1, cp.momentForBox(1, 32, 32)));
        body.setPos(cp.v(size.width /2, size.height - 30));
        var shape = this._space.addShape(new cp.BoxShape(body, 32, 32));
        shape.setElasticity( 0.5 );
        shape.setFriction( 0.5 );
        shape.setCollisionType(2);
        shape.setLayers(NOT_GRABABLE_MASK);
        this.enemy.setBody(body);
        this.addChild(this.enemy);
    },
    onEnter: function () {
        this._super();
        this._debugNode = cc.PhysicsDebugNode.create(this._space);
        this._debugNode.setVisible(true);
        this.addChild(this._debugNode);
    },
    collisionBegin: function (arbiter, space) {
        var that = this;
        var shapes = arbiter.getShapes();
        var collTypeA = shapes[0].collision_type;
        var collTypeB = shapes[1].collision_type;
        if (collTypeA == 1
            && collTypeB == 2)
        {

            var bam = new cc.ParticleSystem(res.bam_plist);
            bam.autoRemoveOnFinish = true;
            bam.x = this.enemy.x;
            bam.y = this.enemy.y;
            this.addChild(bam);


            this._space.addPostStepCallback(function () {
                that.enemy.removeFromParent();
                that._space.removeShape(shapes[0]);
                that._space.removeShape(shapes[1]);
                that._space.removeBody(that.enemy.getBody());
                that.createEnemy();
            });
        }
        return true;
    },
    collisionPre: function (arbiter, space) {
        return true;
    },
    collisionPost: function (arbiter, space) {
        return true;
    },
    collisionSeparate: function (arbiter, space) {
        return true;
    },
    update: function (dt) {
        this._space.step(dt);

        if(this.enemy.x > cc.winSize.width) {
            this.enemyMoveLeft = true;
        }
        if(this.enemy.x < 0) {
            this.enemyMoveLeft = false;
        }
        if(this.enemyMoveLeft) {
            this.enemy.x -= 4;
        } else {
            this.enemy.x += 4;
        }
        if(this.moveLeft) {
            if(this.sprite.x > 0) {
                this.sprite.x -= 6;
            };
        } else {
            if(this.sprite.x < cc.winSize.width) {
                this.sprite.x += 6;
            }
        }

    },
});