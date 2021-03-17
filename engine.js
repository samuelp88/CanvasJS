async function start() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let pontuação = 0;

    class Engine {
        constructor() {
            this._globalSpeed = 1;
            this._msPerFrame = 16;
            this._fps = 1000 / this._msPerFrame;
            this._entitys = [];
            let keymap = [];
            let renderHitboxes = false;
            let stop = false;

            this.stop = function (){
                stop = true;
            }
            this.novaEntidade = function () {
                const entidade = {};
                entidade.collidingWith = [];
                entidade.hitbox = {
                    position: {
                        x: 0,
                        y: 0,
                    },
                    size: {
                        width: 20,
                        height: 20,
                    }
                };
                entidade.position = {
                    x: 0,
                    y: 0,

                };
                entidade.size = {
                    width: 75,
                    height: 75,
                };
                entidade.sprite = new Image();
                entidade.sprite.src = "./coisas/galinhafoda.png";
                entidade.speed = 1;
                entidade.update = undefined;

                entidade.setSize = function (width, height) {
                    entidade.size = {
                        width: width,
                        height: height,
                    }
                    return entidade;
                }
                entidade.setSprite = function (spritePath) {
                    entidade.sprite.src = spritePath;
                    return entidade;
                }
                entidade.setPosition = function (x, y) {
                    entidade.position.x = x;
                    entidade.position.y = y;
                    return entidade;
                }
                entidade.setHitboxSize = function (width, height) {
                    entidade.hitbox.size.width = width;
                    entidade.hitbox.size.height = height;
                    return entidade;
                }
                entidade.setHitboxPosition = function (x, y) {
                    entidade.hitbox.position.x = x;
                    entidade.hitbox.position.y = y;
                    return entidade;
                }
                entidade.render = function (showHitboxes) {
                    ctx.drawImage(entidade.sprite, entidade.position.x, entidade.position.y, entidade.size.width, entidade.size.height);
                    if(showHitboxes) {
                        ctx.strokeRect(entidade.hitbox.position.x, entidade.hitbox.position.y, entidade.hitbox.size.width, entidade.hitbox.size.height);
                    }
                }
                entidade.setUpdate = function (callback) {
                    entidade.update = callback;
                    return entidade;
                }
                entidade.HitMatrix = function (position, size) {
                    let vetor = [];
                    let row = [];
                    for (let i = 0; i < size.width; i++) {

                        let coordenadas = {
                            x: position.x + i,
                            y: position.y,
                        }
                        row.push(coordenadas)
                        if (i === size.width - 1) {
                            vetor.push(row)
                        }
                    }
                    row = [];

                    for (let i = 0; i < size.height; i++) {
                        vetor[0].forEach((value) => {
                            let coordenadas = {
                                x: value.x,
                                y: value.y + i,
                            }
                            row.push(coordenadas)
                        });

                        if (i === size.height - 1) {
                            vetor.push(row)
                        }
                    }
                    vetor = vetor[1];
                    entidade.hitbox = vetor;
                }
                this._entitys.push(entidade);
                return entidade;
            }

            this.renderUpdate = function (showHitboxes) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                this._entitys.forEach((entidade) => {
                    entidade.render(showHitboxes);
                })
                if(stop) return;
                setTimeout(() => {
                    this.renderUpdate(showHitboxes);
                }, this._msPerFrame)
            }

            this.globalUpdate = function () {
                this._entitys.forEach((entidade) => {
                    if (entidade.update) {
                        entidade.update(entidade, keymap);
                    }
                })
                if(stop) return;
                setTimeout(() => {
                    this.globalUpdate();
                }, 1)
            }

            this.start = function () {
                onkeyup = onkeydown = function (e) {
                    keymap[e.key] = e.type == 'keydown';
                }
                this.renderUpdate(renderHitboxes);
                this.globalUpdate();
            }
        }



    }

    const engine = new Engine();
    const background = engine.novaEntidade()
    .setPosition(0,0)
    .setSize(1000, 350)
    .setSprite("./coisas/background.jpg")



    const galinha = engine.novaEntidade()
        .setPosition(0, 175)
        .setHitboxSize(65, 40)
        .setUpdate((self, keymap) => {
            self.setHitboxPosition(self.position.x, self.position.y+10);
            if (keymap['d']) {
                self.position.x += 2;
            }
            if (keymap['a']) {
                self.position.x -= 2;
            }
            if (keymap['s']) {
                engine.stop();
            }
            if (keymap['w'] && !self.pulando) {
                self.pulando = true;
                self.gravidade = false;
                self.alturaPulo = 150;
            }

            if (self.pulando && !self.gravidade) {
                self.position.y -= 2.5;
                self.puloAtual += 2.5;
                if (self.puloAtual > self.alturaPulo) {
                    self.gravidade = true;
                }
            }

            if (self.gravidade && self.position.y < 175) {
                self.position.y += 3;
                self.puloAtual -= 3;
            }
            else if (self.puloAtual <= 0) {
                self.pulando = false;
            }


        })
    galinha.puloAtual = 0;


    const tankFodaMano = engine.novaEntidade()
        .setPosition(1000, 175)
        .setHitboxSize(85, 45)
        .setUpdate((self, keymap) => {
            self.position.x -= 3;
            self.setHitboxPosition(self.position.x + 20, self.position.y + 30);
            if (self.position.x < -125) {
                self.setPosition(1000, self.position.y)
            }

            if (collisionCheck(self, galinha)) {
                if (self.collidingWith.length === 0) {
                    engine.novaEntidade()
                    .setPosition(350, 125)
                    .setSize(300, 100)
                    .setSprite("./coisas/perdeste.png")
                    .setUpdate((self, keymap) => {
                        engine.stop();
                    })
                    self.collidingWith.push(galinha)
                
                }
            }
            else {
                let entityIndex = self.collidingWith.findIndex((v) => {
                    return v === galinha;
                })
                self.collidingWith.splice(entityIndex, 1);
            
            }
        })


    tankFodaMano.sprite.src = "./coisas/blindadofoda.png";
    tankFodaMano.size.width = 125;
    tankFodaMano.size.height = 75;

    engine.start();

}

function collisionCheck(entity1, entity2) {
    if (entity1.hitbox.position.x < entity2.hitbox.position.x + entity2.hitbox.size.width &&
        entity1.hitbox.position.x + entity1.hitbox.size.width > entity2.hitbox.position.x &&
        entity1.hitbox.position.y < entity2.hitbox.position.y + entity2.hitbox.size.height &&
        entity1.hitbox.position.y + entity1.hitbox.size.height > entity2.hitbox.position.y) {
        // collision detected!
        return true;
    }
    else {
        return false;
    }
}