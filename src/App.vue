
<template>
  <div class="options-cont" @click="toggleMenubar()">
    <i class="fa-solid fa-bars" :class="[istoolbarVisible ? 'fa-bars' : 'fa-times' ]"></i>
  </div>
  <div class="tools-cont scale-tools" v-if="istoolbarVisible">
    <img src="./assets/icons/pencil.svg" @click="isPencilToolbarVisible=!isPencilToolbarVisible" alt="">
    <img src="./assets/icons/eraser.svg" @click="isEraserToolbarVisible=!isEraserToolbarVisible" alt="">
    <img src="./assets/icons/download.svg" alt="">
    <img src="./assets/icons/upload.svg" alt="">
    <img src="./assets/icons/stickyNote.svg" alt="" @click="isStickyNoteVisible= !isStickyNoteVisible">
    <img src="./assets/icons/redo.svg" alt="">
    <img src="./assets/icons/undo.svg" alt="">
  </div>

  <div class="pencil-tool-cont" v-if="isPencilToolbarVisible">
    <div class="pencil-width-cont">
      <input type="range" min="1" max="10" value="3">
    </div>
    <div class="pencil-color-cont">
      <div class="black pencil-color"></div>
      <div class="red pencil-color"></div>
      <div class="blue pencil-color"></div>
    </div>
  </div>
  <div class="eraser-tool-cont" v-if="isEraserToolbarVisible">
    <input type="range" min="1" max="10" value="3">
  </div>

  <div class="sticky-cont" v-if="isStickyNoteVisible">
    <div class="header-cont">
      <div class="minimise"></div>
      <div class="remove"></div>
    </div>
    <div class="note-cont">
      <textarea name=""></textarea>
    </div>
  </div>
</template>

<script>
export default{
  mounted(){

  },
  data() {
    return{
     istoolbarVisible: true,
     isPencilToolbarVisible: false,
     isEraserToolbarVisible:false,
     isStickyNoteVisible:false
    }
  },
  methods:{
    toggleMenubar(){
      this.istoolbarVisible = !this.istoolbarVisible;
      if(!this.istoolbarVisible){
        this.isPencilToolbarVisible = false;
        this.isEraserToolbarVisible = false
      }
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
 background-color: orange;
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
</style>
