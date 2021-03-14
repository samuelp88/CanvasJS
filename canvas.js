




function start() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    
    class Galinha {
        constructor() {
            this.position = {
                x: 0,
                y: 0,
            };
    
            this.size = {
                width: 75,
                height: 75,
            };
    
            this.sprite = new Image();
            this.sprite.src = "./coisas/galinhafoda.png";
    
            this.speed = 2;

            this.render = function(){
                ctx.drawImage(this.sprite, this.position.x, this.position.y, this.size.width, this.size.height);
            }
        }
    }

    var galinhafoda = new Galinha();
    galinhafoda.position.y = 50;
    galinhafoda.position.x = 0;




    update();


    function update() {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        galinhafoda.render();

        
    
        galinhafoda.position.x += galinhafoda.speed;
        galinhafoda.size.height += galinhafoda.speed;
        galinhafoda.size.width += galinhafoda.speed;
        if(galinhafoda.size.width > 1200) {
            galinhafoda.size.width = 75;
            galinhafoda.size.height = 75;
            galinhafoda.position.y = 50;
            galinhafoda.position.x = -75;
            galinhafoda.speed += 0.75;
        }
        
        setTimeout(() => {
            update()
        }, 1)
        
    }


}