export default function canvasLogic(){
    let canvas = document.querySelector('canvas')
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let ctx = canvas.getContext('2d');
    let pos = {x:0,y:0}

    window.addEventListener('resize',resize)

}

