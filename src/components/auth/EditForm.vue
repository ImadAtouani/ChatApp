<template>
    
    
        <div v-if="!loading" class="login-container">
    
    
    
    
          <b-form class="login-card" @submit.prevent="edit">
    
    
    
                <b-form-group class="w-100">
                  <label for="profile-picture-input" class="profile-picture-label">
                    <img :src="profilePictureUrl || defaultProfilePicture" alt="Profile Picture" class="profile-picture" />
                    <span>Upload an image</span>
                  </label>
                  <input id="profile-picture-input" type="file" @change="onFileChange" accept="image/*" class="form-control-file" style="display:none;">
                </b-form-group>
    
    
    
    
    
            <b-form-group label="Username" label-for="username-input" class="w-100">
              <b-form-input id="username-input" @input="changed=true" v-model="username" type="text" required placeholder="Choose a username"></b-form-input>
            </b-form-group>
            <b-form-group label="Email" label-for="email-input" class="w-100">
              <b-form-input disabled id="email-input" v-model="email" type="email" class="w-100" required placeholder="Enter your email" ></b-form-input>
            </b-form-group>
             <b-form-group label="Description" label-for="desc-input" class="w-100">
              <textarea @input="textareacchange=true" style="border-radius:7px" id="desc-input" v-model="description" type="email" class="w-100" required placeholder="Description" ></textarea>
            </b-form-group>
            
            <b-button type="submit" variant="success" class="ooopp w-100 mb-2">Save Changes</b-button>
    
            <b-button :disabled='disabled_but' @click="resetpassword"  variant="danger" class=" w-100 mb-2">Change Password</b-button>
          </b-form>
    
    
    
        </div>


        <loadingPage v-if="loadingg" :progress="progr"/>

    

  </template>
  
  <script>
  import Toastify from 'toastify-js';
  import 'toastify-js/src/toastify.css';
  import { auth, firestore, storage } from '@/firebase/Config';
  import { createUserWithEmailAndPassword ,sendPasswordResetEmail } from 'firebase/auth';
  import { doc, setDoc ,collection,query,getDocs,getDoc,where} from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL ,deleteObject} from 'firebase/storage';
  import loadingPage from '@/components/layout/loadingPage.vue';


  export default {
    components:{loadingPage},
    data() {
      return {
        initial:'',
        textareacchange:false,
        textareainitial:'',
        changed:false,
        loadingg:false,
        progr:0,
        disabled_but:false,
        loading:true,
        username: '',
        description:'',
        email: '',
        profilePicture: null,
        profilePictureUrl: '',
        defaultProfilePicture: require('../../assets/default_user.png') // Path to your default profile picture
    
      };
    },
    async created(){
      try{
        const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const da =  userDoc.data();
          this.username = da.username;
          this.initial = da.username;
          this.defaultProfilePicture = da.profileImageUrl;
          this.email = da.email;
          this.description = da.description;
          this.textareainitial = da.description;
          this.loading = false;
          
        } else {
            this.$router.push('/');

           Toastify({
            text: "Something went Wrong",
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "red",
          }).showToast();
          
        } 







      }catch (error){
         Toastify({
            text: error.message,
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "red",
          }).showToast();
          this.$router.push('/');
      }
      


    },
    methods: {
      async edit() {

        if ((!this.textareacchange || this.textareainitial===this.description.trim()) && (!this.changed || this.initial===this.username.trim()) && !this.profilePicture){
          return
        }
     
        this.loadingg = true;



    
        try {

          if (this.changed && this.initial !== this.username.trim()){
          this.loadingg = true;
          const q = query(collection(firestore,'users'),where('username','==',this.username.trim()));
          const querySnapshot = await getDocs(q);
          const verifiction = []
          querySnapshot.forEach((doc)=>{
            verifiction.push(doc.id)
          });
          this.progr = 30;

          if (verifiction.length !== 0){
            Toastify({
            text: "this Username is Already used",
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "red",
          }).showToast();

          this.loadingg = false;

            return;
          }

      }
       

        this.progr = 60;



        let profileImageUrl = '';


        if (this.profilePicture) {

          const oldImageRef = ref(storage, this.defaultProfilePicture);
          await deleteObject(oldImageRef);



          const storageRef = ref(storage, `profileimages/${auth.currentUser.uid}/${this.profilePicture.name}`);
          await uploadBytes(storageRef, this.profilePicture);
          profileImageUrl = await getDownloadURL(storageRef);
          this.progr = 80;

          await setDoc(doc(firestore, 'users', auth.currentUser.uid), {
          email: this.email,
          username: this.username,
          description:this.description,
          profileImageUrl
        },{ merge: true });
        }
        else{
          await setDoc(doc(firestore, 'users', auth.currentUser.uid), {
          email: this.email,
          username: this.username.trim(),
          description:this.description.trim(),
        },{ merge: true });
        }
        


        this.progr = 100;




        this.$router.push('/'); // Redirect to homepage or dashboard after registration
        Toastify({
        text: "Profile edited Successfully",
        duration: 3000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        backgroundColor: "green",
      }).showToast();








        } catch (error) {
          this.loadingg = false;
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
      goToLogin() {
        this.$router.push('/');
      },
      onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePicture = file;
        this.profilePictureUrl = URL.createObjectURL(file);
      }

      },
      async resetpassword(){
      try {
        this.disabled_but = true;
        await sendPasswordResetEmail(auth, this.email);

         Toastify({
            text: "An email was sent to your mailbox to reset your password",
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "green",
          }).showToast();
        this.disabled_but = false;



      } catch (error) {
         Toastify({
            text: 'Failed to send password reset email. Please check the email address and try again.',
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "red",
          }).showToast();
        this.disabled_but = false;

      }

    },
    },
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
    width: 100%;
    height:100%
  
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
  input {
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
  .profile-picture-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 2px solid #ccc;
}
  </style>
  