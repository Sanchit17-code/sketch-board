
<template>
  <div class="options-cont" @click="toggleMenubar()">
    <i class="fa-solid fa-bars" :class="[istoolbarVisible ? 'fa-bars' : 'fa-times' ]"></i>
  </div>
  <div class="tools-cont scale-tools" id="tools-cont-id" v-if="istoolbarVisible">
    <img src="./assets/icons/pencil.svg" @click="togglePencil()" alt="">
    <img src="./assets/icons/eraser.svg" @click="toggleEraser();" alt="">
    <img src="./assets/icons/download.svg" alt="">
    <img @click="uploadFileInNote" src="./assets/icons/upload.svg" alt="">
    <img src="./assets/icons/stickyNote.svg" alt="" @click="isStickyNoteVisible= !isStickyNoteVisible">
    <img src="./assets/icons/redo.svg" @click="redo" alt="redo">
    <img src="./assets/icons/undo.svg" @click="undo" alt="undo">
  </div>

  <div class="pencil-tool-cont" v-if="isPencilToolbarVisible">
    <div class="pencil-width-cont">
      <input type="range" min="1" max="20" v-model="lineWidth">
    </div>
    <div class="pencil-color-cont">
      <div class="each-color-cont">
        <div class="black pencil-color" @click="lineColor = 'black'"></div>
        <i class="fa fa-check tick" v-if="lineColor == 'black'" aria-hidden="true"></i>
      </div>
      <div class="each-color-cont">
        <div class="red pencil-color"   @click="lineColor = 'red'"></div>
        <i class="fa fa-check tick" v-if="lineColor == 'red'" aria-hidden="true"></i>
      </div>
      <div class="each-color-cont">
        <div class="blue pencil-color"  @click="lineColor = 'blue'"></div>
        <i class="fa fa-check tick" v-if="lineColor == 'blue'" aria-hidden="true"></i>
      </div>
    </div>
  </div>
  <div class="eraser-tool-cont" v-if="isEraserToolbarVisible">
    <input type="range" min="20" max="160" v-model="eraserSize">
  </div>

  <div class="sticky-cont" v-if="isStickyNoteVisible" ref="draggableContainer">
    <div class="header-cont"  @mousedown="dragMouseDown">
      <div class="minimise"  @click="isTextAreaVisible=!isTextAreaVisible"></div>
      <div class="remove" @click="isStickyNoteVisible=false"></div>
    </div>
    <div class="note-cont" v-show="isTextAreaVisible">
      <textarea name=""></textarea>
    </div>
  </div>
  <div class="sticky-cont" v-show="isStickyNoteHavingFileVisible" ref="draggableContainer">
    <div class="header-cont"  @mousedown="dragMouseDown">
      <div class="minimise"  @click="isImageAreaVisible=!isImageAreaVisible"></div>
      <div class="remove" @click="isStickyNoteHavingFileVisible=false"></div>
    </div>
    <div class="note-cont" v-show="isImageAreaVisible">
      <img id="imageArea" src="" alt="">
    </div>
  </div>
  <canvas id="canvas"></canvas>
</template>

<script>
// import canvasLogic from './canvas'
export default{
  mounted(){
    this.canvasLogic();
  },
  data() {
    return{
      istoolbarVisible: true,
      isPencilToolbarVisible: false,
      isEraserToolbarVisible:false,
      isStickyNoteVisible:false,
      isStickyNoteHavingFileVisible: false,
      isTextAreaVisible:true,
      isImageAreaVisible:true,
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0
      },
      ctx:'',
      pos :{x:0,y:0},
      eraserSize:40,
      lineWidth:5,
      lineColor:'black',
      actionObj:{
        type:'draw',
      },
      undoArray:[],
      redoArray:[],
      currentArray:[],

    }
  },
  methods:{
    togglePencil(){
      this.isPencilToolbarVisible=!this.isPencilToolbarVisible;
      if(this.isEraserToolbarVisible)
        this.isEraserToolbarVisible = false;
    },
    toggleEraser(){
      this.isEraserToolbarVisible=!this.isEraserToolbarVisible
      if(this.isPencilToolbarVisible)
        this.isPencilToolbarVisible = false;
    },
    canvasLogic(){
      let canvas = document.querySelector('canvas')
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      this.ctx = canvas.getContext('2d');
      this.pos = {x:0,y:0}
      window.addEventListener('resize',this.resize)
      document.addEventListener('mousemove',this.draw)
      document.addEventListener('mouseup',this.finalizePosition)
      document.addEventListener('mousedown',this.setPosition)
      document.addEventListener('mousedown',this.initializePosition)
      // document.addEventListener('mouseenter',this.setPosition)

    },
    setPosition(e){
      this.pos.x = e.clientX;
      this.pos.y = e.clientY;
    },
    initializePosition(e){
      if (e.target.closest('#tools-cont-id')) {
        return;
      }
      this.actionObj.posArray = [];
      this.actionObj.posArray.push({
        x : e.clientX,
        y : e.clientY,
      })
      console.log("initialize", e.clientX, e.clientY);
    },
    finalizePosition(e){
      console.log("3eqffq",[]);
      if (e.target.closest('#tools-cont-id')) {
        return;
      }
      this.actionObj.posArray.push({
        x : e.clientX,
        y : e.clientY,
      })
      this.actionObj = JSON.parse(JSON.stringify(this.actionObj));
      console.log("finalize", e.clientX, e.clientY);
      let N = this.undoArray.length;
      this.currentArray = JSON.parse(JSON.stringify(this.undoArray[N-1] || [])) ; // as undo array is a 2d array, so the latest is the last array of undo array
      this.currentArray = JSON.parse(JSON.stringify([... this.currentArray])) 
      console.log('this.currentArray:', JSON.parse(JSON.stringify(this.currentArray)));
      this.currentArray.push(this.actionObj);
      console.log('this.currentArray: ', JSON.parse(JSON.stringify(this.currentArray)));
      this.undoArray.push(JSON.parse(JSON.stringify(this.currentArray)))
      this.redoArray=[]; // whenever adding new lines or points, redo array should become empty as nothing to redo now.
      this.undoArray = JSON.parse(JSON.stringify(this.undoArray));
      console.log('this.undoArray: ', JSON.parse(JSON.stringify(this.undoArray)));
    },
    resize(){
      this.ctx.canvas.height = window.innerHeight;
      this.ctx.canvas.width = window.innerWidth;
    },
    draw(e){     
      // console.log("e.target",e.target); 
      if (e.target.closest('#tools-cont-id')) {
        return;
      }
      if(e.buttons !==1)
        return;
      // console.log('e: ', e);
      if(!this.isEraserToolbarVisible){  
        this.actionObj.type = 'draw';
        this.actionObj.color = this.lineColor;
        this.actionObj.width = this.lineWidth;
        this.ctx.beginPath();
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.strokeStyle = this.lineColor;
        this.ctx.moveTo(this.pos.x,this.pos.y);
        this.setPosition(e)
        this.actionObj.posArray.push({
          x : this.pos.x,
          y : this.pos.y,
        })
        this.ctx.lineTo(this.pos.x,this.pos.y);
        this.ctx.stroke(); 
      }
      else{
        this.setPosition(e)
        this.ctx.clearRect(
          this.pos.x,
          this.pos.y,
          this.eraserSize,
          this.eraserSize
        );
      }
    },
    redo(){
      if(!this.redoArray.length)
      return ;
      this.clearCanvas()
      this.undoArray.push(this.redoArray.pop())
      this.redrawActions();
    },
    undo(){
      this.clearCanvas()
      // let lastArray = this.undoArray[this.undoArray.length-1];
      console.log('this.undoArray: ', this.undoArray);
      console.log(this.undoArray.length);
      this.redoArray.push(this.undoArray.pop())
      console.log(this.undoArray.length);
      this.redrawActions();
    },
    redrawActions(){
      console.log(this.undoArray.length);
      let N = this.undoArray.length;
      let latestActionsArray = this.undoArray[N-1]|| [];
      console.log('latestActionsArray: ', latestActionsArray);
      latestActionsArray.forEach((actionObj)=>{
        this.ctx.beginPath();
        this.ctx.lineWidth = actionObj.width;
        this.ctx.strokeStyle = actionObj.color;
        for(let i=0;i<actionObj.posArray.length-1;i++){
          this.ctx.moveTo(actionObj.posArray[i].x,actionObj.posArray[i].y)
          this.ctx.lineTo(actionObj.posArray[i+1].x,actionObj.posArray[i+1].y)
          this.ctx.stroke();
        }
      })
    },
    clearCanvas(){
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    uploadFileInNote(){
      let input = document.createElement('input');
      input.setAttribute('type',"file");
      input.setAttribute('accept', 'image/*');
      input.click();
      input.addEventListener('change',this.handleFileSelect)
    },
    handleFileSelect(event){
      const file = event.target.files[0];
      if(file){
        const imageURL = URL.createObjectURL(file)
        const imageTag = document.getElementById('imageArea')
        console.log('imageTag: ', imageTag);
        imageTag.src = imageURL;
        this.isStickyNoteHavingFileVisible = true;
      }
    },
    toggleMenubar(){
      this.istoolbarVisible = !this.istoolbarVisible;
      if(!this.istoolbarVisible){
        this.isPencilToolbarVisible = false;
        this.isEraserToolbarVisible = false
      }
    },
    dragMouseDown: function (event) {
      event.preventDefault()
      // get the mouse cursor position at startup:
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      document.onmousemove = this.elementDrag
      document.onmouseup = this.closeDragElement
    },
    elementDrag: function (event) {
      event.preventDefault()
      this.positions.movementX = this.positions.clientX - event.clientX
      this.positions.movementY = this.positions.clientY - event.clientY
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      // set the element's new position:
      this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
      this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
    },
    closeDragElement () {
      document.onmouseup = null
      document.onmousemove = null
    }
  }
}

</script>


<style scoped>
.options-cont{
  height: 4rem;
  width: 3.5rem;
  background-color: #f1f2f6;
  position: absolute;
  left: 2rem;
  top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
img{
  display:block;
  width: 4rem;
}
.tools-cont{
  height: 5rem;
  width: 55vw;
  display: flex;
  background-color: #f1f2f6;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  position: absolute;
  top: 2rem;
  left: 25vw;
  justify-content: space-around;
}
.scale-tools{
  animation-name: scale-tools;
  animation-duration: 1s;
}
@keyframes scale-tools {
  0%{
    transform: scale(0.1);
  }
  100%{
    transform: scale(1);
  }
}
.pencil-tool-cont{
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  background-color: #f1f2f6;
  width: 8rem;
  height: 5rem;
  position: absolute;
  top: 7rem;
  left: 25vw;
}
.pencil-width-cont{
  display: flex;
  justify-content: center;
  align-items: center;
}
.each-color-cont{
  position: relative;
}
.tick{
  position: absolute;
  left: 5px;
}
.pencil-width-cont input{
  width: 80%;
}
.pencil-color-cont{
  height: calc(100% - 2rem);
}
.pencil-color{
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%
}
.black{
  background-color: black;
}
.red{
  background-color: red;
}
.blue{
  background-color: blue;
}
.pencil-color-cont{
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-content: center;
  gap: 10px;
}
.eraser-tool-cont{
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  background-color: #f1f2f6;
  width: 8rem;
  height: 2rem;
  position: absolute;
  top: 7rem;
  left: 33vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.eraser-tool-cont input{
  width: 80%;
}

.sticky-cont{
  height: 15rem;
  width: 15rem;
  position: absolute;
  top: 15rem;
  left: 10rem
  /* background-color: red; */
}
.header-cont{
  height: 2rem;
  width: 15rem;
  background-color: blue;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: #f1f2f6;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

}
.header-cont > *{
  height: 1rem;
  width: 1rem;
  margin-right: 0.5rem;
  border-radius: 50%;
}
.minimise{
 background-color: green;
}
.remove{
 background-color: red;
}

.note-cont{
  height: calc(100% - 2rem);
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

  /* background-color: yellow; */
}
.note-cont textarea{
  height: 100%;
  width: 100%;
  outline: none;
  border:none;
  resize: none;
}
.note-cont img{
  height: 100%;
  width: 100%;
  object-fit: contain;
}
</style>