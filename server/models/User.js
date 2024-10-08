import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String,
        required: true 
    },
    resetPasswordToken: {
         type: String,
          default: '' 
        },
    resetPasswordExpires: {
         type: Date 
        },
    
    role: { 
        type: String,
        required: true,
        enum: ['client', 'admin'],  
        default: 'client'           
    }, 
    activated: {
      type: Boolean,
      required: false,
      default: true,
    }
});
const setUserInfo = ({ name, email, role, token }) => {
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('role', role)
    localStorage.setItem('token', token); 
  };
  
  const clearUserInfo = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
  };
  const getUserInfo = () => {
    return {
      name: localStorage.getItem('userName'),
      email: localStorage.getItem('userEmail'),
      role: localStorage.getItem('role')
    };
  };
  

const UserModel = mongoose.model("User", UserSchema);

export { UserModel, getUserInfo, setUserInfo, clearUserInfo };

  
  
  