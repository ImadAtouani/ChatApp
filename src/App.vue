<template>
  <b-container fluid class="container">
    <RouterView />
  </b-container>


 

</template>



<script>
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default {
  data() {
    return {
      showModal: false
    };
  },
  mounted() {
    // Attach an event listener to the beforeunload event
    //window.addEventListener("beforeunload", this.handleBeforeUnload);
  },
  beforeDestroy() {
    // Remove the event listener when the component is destroyed
    //window.removeEventListener("beforeunload", this.handleBeforeUnload);
  },
  methods: {
    handleBeforeUnload(event) {
      // Prevent the default behavior to show the browser's built-in dialog
    
    },
    handleLeave() {
      // Perform any necessary actions before leaving
      // For example, saving data or cleaning up resources
      // Close the modal
      this.showModal = false;
      // Allow the page to be unloaded
      window.removeEventListener("beforeunload", this.handleBeforeUnload);
    },
    cancelLeave() {
      // Cancel the leave action and close the modal
      this.showModal = false;
    }
  }
};
</script>

<style>
body{
      
        background-image: url("./assets/bg.jpg");
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100%;
  
}

body{
      
        background: linear-gradient(45deg, #6ec3f4, #3a7bd5, #00d2ff, #a8e6ff);
        display: flex;
        background-size: 300% 300%;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100%;
        animation: color 12s ease-in-out infinite;
  
}
@keyframes color{
  0%{background-position :0 50%}
50% {background-position : 100% 50%}
100% {background-position : 0 50%}

}



.ooo {
  transition: width 0.5s ease-in-out;
  height: 90vh;
}
.animated {
  transition: width 0.5s ease-in-out;
}

#app {
  color: white;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  display: flex;
  justify-content: center;
  height: 90vh;
  background-color: rgba(12, 26, 53, 0.75);
  border-radius: 12px;
  backdrop-filter: blur(19px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.125);
}


</style>
