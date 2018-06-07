var canv = document.getElementById("gameWorld");
var ctx = canv.getContext("2d", { alpha: false });
var gameEngine = new GameEngine();




for (var i = 0; i < 50; i++) {//0 has crash from set focus
    gameEngine.addEntity(new Lipid(Calc.randomInt(canv.width), Calc.randomInt(canv.height), Calc.randomInt(360), 1, i));
}

//gameEngine.getEntities()[eIndex].setFocus(true);
console.log(eIndex, gameEngine.getEntities()[eIndex].isFocus());


// for (var i = 0; i < 1; i++) {//0 has crash from set focus
//     gameEngine.addEntity(new Fatty(Calc.randomInt(canv.width), Calc.randomInt(canv.height), Calc.randomInt(360) , i));
// }


for (var i = 0; i < 10; i++) {
    gameEngine.addEntity(new Amino(Calc.randomInt(canv.width), Calc.randomInt(canv.height), Calc.randomInt(360) , i));
}

/*
for (var i = 0; i < 10; i++) {
    gameEngine.addEntity(new Nucleotide(randomInt(canv.width), randomInt(canv.height), randomInt(360) , i));
}
*/

c = new Camera(0,0, gameEngine.getEntities()[0]);
gameEngine.addEntity(c);

gameEngine.init(ctx);
gameEngine.start();
