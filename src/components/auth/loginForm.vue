<template>
  <div class="login-container">

    <b-form class="login-card" @submit.prevent="login">
      <b-form-group label="Email" label-for="email-input" class="w-100">
        
        <b-form-input id="email-input" v-model="email" type="email" required placeholder="Enter your email"></b-form-input>
      </b-form-group>
      <b-form-group label="Password" label-for="password-input" class="w-100">
        <b-form-input id="password-input" v-model="password" type="password" required placeholder="Enter your password"></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="success" class="ooopp w-100 mb-2">Login</b-button>
      <b-button @click="goToSignUp"   class="ooooo w-100 mb-2">Sign Up</b-button>
      <b-button  @click="goToResetPassword"  class="op mb-2 w-100">Forgot Password?</b-button>
    </b-form>
  </div>


  <loadingPage v-if="loading" :progress="progr" />
</template>


<script>
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { auth ,firestore} from '@/firebase/Config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import loadingPage from '@/components/layout/loadingPage.vue';

import { createUserWithEmailAndPassword ,sendPasswordResetEmail } from 'firebase/auth';
import { doc, updateDoc,setDoc ,collection,query,orderBy,getDocs,getDoc,where,limit,onSnapshot,getCountFromServer,arrayRemove,arrayUnion, Timestamp,addDoc,deleteDoc} from 'firebase/firestore';
import { ref, uploadBytes,listAll ,getDownloadURL ,deleteObject} from 'firebase/storage';




export default {
  components:{loadingPage},
  data() {
    return {
      email: '',
      password: '',
      loading:false,
      progr:0,
    };
  },
  methods: {
    async login() {
      try {
        this.loading = true;
        this.progr = 30;
        await signInWithEmailAndPassword(auth, this.email, this.password);

        const UserDocRef = doc(firestore, "users", auth.currentUser.uid);

                  



        await updateDoc(UserDocRef, {
            status: true
        });





        this.progr = 100;




        
        this.$router.push('/');
        Toastify({
        text: "Successful",
        duration: 3000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        backgroundColor: "green",
      }).showToast();

      } catch (error) {
        this.loading = false;

        Toastify({
        text: error.message,
        duration: 3000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        backgroundColor: "red",
      }).showToast();
      }
    },
    goToSignUp() {
      this.$router.push('/signup');
    },
    goToResetPassword() {
      this.$router.push('/reset-password');
    }
  }
};
</script>

<style scoped>
/* Light Blue Gradient Buttons with Animations */
.op, .ooooo, .ooopp {
  border: none;
  color: white;
  background-size: 200% auto;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  text-shadow: 0 1px 1px rgba(0,0,0,0.2);
}

/* Primary Light Blue Button */
.op {
  background: linear-gradient(135deg, #68c5ff, #3d9eff);
  box-shadow: 0 3px 6px rgba(61, 158, 255, 0.2);
}
.op:hover {
  background: linear-gradient(135deg, #3d9eff, #1a87eb);
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(61, 158, 255, 0.3);
}

/* Secondary Sky Blue Button */
.ooooo {
  background: linear-gradient(135deg, #a8e1ff, #7bc8ff);
}
.ooooo:hover {
  background: linear-gradient(135deg, #7bc8ff, #4db0ff);
  animation: gentlePulse 2s infinite;
}

/* Ice Blue Accent Button */
.ooopp {
  background: linear-gradient(135deg, #c2ebff, #9dd9ff);
}
.ooopp:hover {
  background: linear-gradient(135deg, #9dd9ff, #68c5ff);
  transform: scale(1.03);
}

/* Custom Animations */
@keyframes gentlePulse {
  0% { box-shadow: 0 0 0 0 rgba(123, 200, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(123, 200, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(123, 200, 255, 0); }
}

/* Bonus: Add this for click feedback */
.op:active, .ooooo:active, .ooopp:active {
  transform: scale(0.98);
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%

}

.login-card {
   display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; 
  gap : 10px;
  width: 100%;
  max-width: 360px; /* Max width for the form */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}
input{
  
  
  border-radius: 9px;
  backdrop-filter: blur(19px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.125);
}
.btn-block {
  width: 100%;
  margin-bottom: 10px; /* Margin between buttons */
  background-color: rgba(151, 151, 204, 0.342);
}

/* Additional styles for form elements */
b-form-input {
  border-radius: 4px;
}

/* Styling for buttons for better UI consistency */
b-button {
  border-radius: 4px;
}
</style>
